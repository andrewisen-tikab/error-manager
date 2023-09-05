import { EVENT_TYPES } from './constants';

/**
 * Abstract object that can be converted to and from JSON.
 */
export type AbstractObject = {
    /**
     * Convert the object to a JSON string.
     */
    toJSON: () => string;
    /**
     * From a JSON string, create an new object.
     * This will erase all the properties of the current object.
     * @param json JSON string.
     */
    fromJSON: (json: string) => void;
    timestamp: Date;
};

/**
 * Abstract `history` object.
 * Holds the user's action at a given time.
 */
export interface AbstractHistoryObject extends AbstractObject {
    isHistoryObject: boolean;
}

/**
 * Abstract `error` object.
 * Holds the error and the stack trace at a given time.
 */
export interface AbstractErrorObject extends AbstractObject {
    isErrorObject: boolean;
}

/**
 * Abstract `error` manager.
 *
 * Used to manage the `errors` thrown by the application and `history` of the user.
 */
export type AbstractErrorManager = {
    /**
     * ## Usage
     *
     * If you want to throw an error, use:
     * ```ts
     * throw await errorManager.error('error');
     * ```
     *
     * or, if you want the app to continue running, use:
     *
     * ```ts
     * errorManager.error('error');
     * ```
     * @param _error
     * @returns Error to be thrown
     */
    error: (error: AbstractErrorObject) => Promise<Error>;
    /**
     * @returns Readonly array of errors.
     */
    getErrors: () => Readonly<AbstractErrorObject[]>;
    /**
     * @returns Readonly array of history.
     */
    getHistory: () => Readonly<AbstractHistoryObject[]>;
    /**
     * Add a history object to the `history`.
     * @param _history A custom history object.
     */
    addHistory: (history: AbstractHistoryObject) => Promise<void>;
    /**
     * Export the `errors` and `history` as a custom ZIP file.
     * @param downloadFile If `true`, the file will be downloaded by the client.
     * @returns The file as a blob and the file name.
     */
    export: (downloadFile: boolean) => Promise<{
        fileName: string;
        blob: Blob;
    }>;
    /**
     * Clear the `errors` and `history`.
     */
    clear: () => Promise<void>;
    /**
     * Attempt to clear the `errors`.
     * @returns `true` if the `errors` and `history` were cleared.
     */
    attemptClearAsync: () => Promise<boolean>;
};

export type StoreObject = {
    errors: AbstractErrorObject[];
    history: AbstractHistoryObject[];
};

export type ExportObject = {
    [key: string]: string;
};

/**
 * Abstract event listener.
 */
export type Listener = (event?: DispatcherEvent) => void;

/**
 * Custom events that can be dispatched, and be listened to.
 */
export type DispatcherEvent =
    | { type: typeof EVENT_TYPES.ERROR; error: AbstractErrorObject }
    | { type: typeof EVENT_TYPES.HISTORY; history: AbstractHistoryObject }
    | { type: typeof EVENT_TYPES.EXPORT_BEGIN }
    | { type: typeof EVENT_TYPES.EXPORT_DONE };
