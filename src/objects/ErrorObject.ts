import { AbstractErrorObject } from '../types';
import StackTrace from 'stacktrace-js';

type Params = {
    key: string;
    description?: string;
    timestamp: Date;
    stackTrace?: string;
};

export default class ErrorObject implements AbstractErrorObject, Params {
    public key: string;
    public description: string | undefined;
    public timestamp: Date;
    public stackTrace: string | undefined;

    public isErrorObject = true;

    constructor(key: string, description?: string) {
        this.key = key;
        this.description = description;
        this.timestamp = new Date();

        this._getStackTrace().then((stack) => {
            this.stackTrace = stack;
        });
    }

    toJSON() {
        const object: Params = {
            key: this.key,
            description: this.description,
            timestamp: this.timestamp,
            stackTrace: this.stackTrace,
        };
        return JSON.stringify(object);
    }

    public fromJSON(json: string) {
        const object = JSON.parse(json) as Partial<Params>;
        Object.assign(this, object);
    }

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
