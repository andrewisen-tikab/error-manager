import { saveAs } from 'file-saver';

import { BlobWriter, TextReader, ZipWriter, ZipWriterConstructorOptions } from '@zip.js/zip.js';

import {
    AbstractErrorManager,
    AbstractErrorObject,
    AbstractHistoryObject,
    ExportObject,
    StoreObject,
} from './types';
import { INDEXEDDB, createInstance } from 'localforage';
import EventDispatcher from './core/EventDispatcher';
import { EVENT_TYPES } from './constants';
import { getUser } from './utils';

/**
 * Error manager that handles the application's `errors` and the user's `history`.
 *
 * If, or when, the app crashes, the `errors` and `history` will be exported to a zip file.
 * The zip file will be encrypted with a password. The password is `123456789`.
 *
 * This means that you, as a developer, can read the `errors` and `history` of the user.
 * No more guessing or vague descriptions of the error.
 *
 * You can only read the `errors` and `history` of the user if the user sends you the zip file.
 * The zip file will be saved in the `downloads` folder of the user's device.
 * The zip file will be named `MyErrorReport_<date>.errorReport`.
 *
 * No data will be sent to any server. You need to add that yourself :)
 */
export default class ErrorManager extends EventDispatcher implements AbstractErrorManager {
    /**
     * {@link ErrorManager} singleton
     */
    private static _instance: ErrorManager;

    public static DEBUG = true;

    public static FILE_PREFIX = 'MyErrorReport' as const;
    public static FILE_EXTENSION = 'errorReport' as const;
    public static PASSWORD = '123456789' as const;
    public static STORE_NAME = 'errorStore' as const;
    public static STORE_KEY = 'errors' as const;

    /**
     * Errors that have been thrown.
     */
    private _errors: AbstractErrorObject[];
    /**
     * Log of all actions that have been performed.
     */
    private _history: AbstractHistoryObject[];

    private _store: LocalForage;

    /**
     * Generate {@link ViewerOverlord} singleton
     */
    public static get Instance() {
        return this._instance || (this._instance = new this());
    }

    constructor(attemptClear: boolean = true) {
        super();
        this._errors = [];
        this._history = [];
        this._store = createInstance({
            name: ErrorManager.STORE_NAME,
            driver: INDEXEDDB,
        });
        if (attemptClear) this.attemptClearAsync();
    }

    public async error(_error: AbstractErrorObject): Promise<Error> {
        if (!_error.isErrorObject) throw new Error("Object isn't a error object.");

        this._errors.push(_error);

        this._saveAsync();

        this.dispatchEvent({ type: EVENT_TYPES.ERROR, error: _error });

        return Error('Method not implemented.');
    }

    public getErrors(): Readonly<AbstractErrorObject[]> {
        return this._errors;
    }

    public async addHistory(_history: AbstractHistoryObject): Promise<void> {
        if (!_history.isHistoryObject) throw new Error("Object isn't a history object.");

        this._history.push(_history);

        this._saveAsync();

        this.dispatchEvent({ type: EVENT_TYPES.HISTORY, history: _history });
    }

    public getHistory(): Readonly<AbstractHistoryObject[]> {
        return this._history;
    }

    private async _saveAsync(): Promise<void> {
        const storeObject: StoreObject = {
            errors: this._errors,
            history: this._history,
        };
        await this._store.setItem(ErrorManager.STORE_KEY, storeObject);
    }

    async clear(): Promise<void> {
        this._errors = [];
        this._history = [];
        const storeObject: StoreObject = {
            errors: this._errors,
            history: this._history,
        };
        await this._store.setItem(ErrorManager.STORE_KEY, storeObject);
    }

    public async attemptClearAsync(): Promise<boolean> {
        // Determine if the `errors` and `history` should be cleared.
        if (await this.shouldClear()) {
            await this.clear();
            return true;
        } else {
            // If not, attempt to load the `errors` and `history` from the store.
            const object: StoreObject | null = await this._store.getItem(ErrorManager.STORE_KEY);

            // If failed, clear the `errors` and `history` anyway.
            if (object == null) {
                await this.clear();
                return true;
            }

            // Finally, set the `errors` and `history` to the loaded values.
            this._history = object.history;
            this._errors = object.errors;
        }
        return false;
    }

    /**
     * Determine if the `errors` and `history` should be cleared.
     * Override this method to change the behavior.
     * @returns `true` if the `errors` and `history` were cleared.
     */
    protected async shouldClear(): Promise<boolean> {
        // If in debug mode, always clear
        if (ErrorManager.DEBUG) return true;

        const storeObject: StoreObject | null = await this._store.getItem(ErrorManager.STORE_KEY);
        if (storeObject === null) return true; // Clear just to be safe

        const latestError: AbstractErrorObject | undefined =
            storeObject.errors[storeObject.errors.length - 1];

        if (latestError === undefined) return true; // Clear just to be safe

        const timestamp: Date | undefined = latestError.timestamp;

        if (timestamp === undefined) return true; // Clear just to be safe

        const today = new Date();

        // Check if one day has passed since the last error
        if (latestError.timestamp.getDate() !== today.getDate()) {
            this.clear();
            this._saveAsync();
            return true;
        }
        return false;
    }

    private _getUser() {
        return getUser();
    }

    private _getFileName(): string {
        if (ErrorManager.DEBUG) return 'debug.zip';

        // Get current date and time as string
        const now = new Date().toISOString();
        // Replace all characters that are not numbers or letters with an underscore
        const nowString = now.replace(/[^a-zA-Z0-9]/g, '_');
        return `${ErrorManager.FILE_PREFIX}_${nowString}.${ErrorManager.FILE_EXTENSION}`;
    }

    private async _getZipFileBlob() {
        const params: ZipWriterConstructorOptions = ErrorManager.DEBUG
            ? {}
            : {
                  password: ErrorManager.PASSWORD,
                  encryptionStrength: 1,
              };

        const zipWriter = new ZipWriter(new BlobWriter('application/zip'), params);

        const history = this._convertHistory();
        const errors = this._convertErrors();

        const historyPromises = Object.entries(history).map(([fileName, data], index: number) =>
            zipWriter.add(
                `history/${index}_${fileName}.json`,
                new TextReader(JSON.stringify(data)),
            ),
        );

        const errorPromises = Object.entries(errors).map(([fileName, data], index: number) =>
            zipWriter.add(`errors/${index}_${fileName}.json`, new TextReader(JSON.stringify(data))),
        );

        const user = this._getUser();
        const userPromise = zipWriter.add(`user.json`, new TextReader(JSON.stringify(user)));

        await Promise.all([...historyPromises, ...errorPromises, userPromise]);

        return zipWriter.close();
    }

    private _convertHistory(): ExportObject {
        const history: ExportObject = {};
        this._history.forEach((_history) => {
            history[_history.timestamp.toISOString()] = JSON.parse(_history.toJSON());
        });
        return history;
    }

    private _convertErrors(): ExportObject {
        const errors: ExportObject = {};
        this._errors.forEach((_error) => {
            errors[_error.timestamp.toISOString()] = JSON.parse(_error.toJSON());
        });
        return errors;
    }

    public async export(downloadFile: boolean = true): Promise<{
        fileName: string;
        blob: Blob;
    }> {
        const fileName = this._getFileName();

        this.dispatchEvent({ type: EVENT_TYPES.EXPORT_BEGIN });

        const blob = await this._getZipFileBlob();

        this.dispatchEvent({ type: EVENT_TYPES.EXPORT_DONE });
        if (downloadFile) this._downloadFile(blob, fileName);
        return { fileName, blob };
    }

    private _downloadFile(blob: Blob, fileName: string): void {
        saveAs(blob, fileName);
    }
}
