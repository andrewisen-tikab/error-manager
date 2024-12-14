import { AbstractErrorObject } from '../types';
import StackTrace from 'stacktrace-js';

/**
 * Represents the parameters for an error object.
 */
type Params = {
    /**
     * A unique identifier for the error.
     */
    key: string;
    /**
     * An optional description of the error.
     */
    description?: string;
    /**
     * The date and time when the error occurred.
     */
    timestamp: Date;
    /**
     * An optional stack trace for the error.
     */
    stackTrace?: string;
};

/**
 * Represents an error object with a key, description, timestamp, and stack trace.
 * Implements the `AbstractErrorObject` and `Params` interfaces.
 *
 * @implements {AbstractErrorObject}
 * @implements {Params}
 */
export class ErrorObject implements AbstractErrorObject, Params {
    public key: string;

    public description: string | undefined;

    public timestamp: Date;

    public stackTrace: string | undefined;

    public isErrorObject = true;

    /**
     * Creates an instance of ErrorObject.
     *
     * @param key - A unique identifier for the error.
     * @param description - An optional description of the error.
     */
    constructor(key: string, description?: string) {
        this.key = key;
        this.description = description;
        this.timestamp = new Date();

        this._getStackTrace().then((stack) => {
            this.stackTrace = stack;
        });
    }

    toJSON(): string {
        const object: Params = {
            key: this.key,
            description: this.description,
            timestamp: this.timestamp,
            stackTrace: this.stackTrace,
        };
        return JSON.stringify(object);
    }

    public fromJSON(json: string): void {
        const object = JSON.parse(json) as Partial<Params>;
        Object.assign(this, object);
    }

    /**
     * Retrieves the current stack trace as a string.
     *
     * This method uses the `StackTrace.get()` function to obtain an array of stack frames,
     * converts each stack frame to a string, and joins them with newline characters.
     *
     * @returns {Promise<string>} A promise that resolves to the stringified stack trace.
     */
    private async _getStackTrace(): Promise<string> {
        const stackFrames = await StackTrace.get();
        const stringifiedStack = stackFrames
            .map(function (sf) {
                return sf.toString();
            })
            .join('\n');
        return stringifiedStack;
    }
}
