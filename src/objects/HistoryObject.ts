import { AbstractHistoryObject } from '../types';

type Params = {
    key: string;
    title?: string;
    description?: string;
    timestamp: Date;
};

export default class HistoryObjects implements AbstractHistoryObject, Params {
    public key: string;
    public description: string | undefined;
    public timestamp: Date;

    public isHistoryObject = true;

    constructor(key: string, description?: string) {
        this.key = key;
        this.description = description;
        this.timestamp = new Date();
    }

    toJSON() {
        const object: Params = {
            key: this.key,
            description: this.description,
            timestamp: this.timestamp,
        };
        return JSON.stringify(object);
    }

    public fromJSON(json: string) {
        const object = JSON.parse(json) as Partial<Params>;
        Object.assign(this, object);
    }
}
