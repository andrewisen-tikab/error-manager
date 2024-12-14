import { AbstractHistoryObject } from '../types';

/**
 * Represents the parameters for a history object.
 */
type Params = {
    /**
     * A unique identifier for the history object.
     */
    key: string;
    /**
     * An optional title for the history object.
     */
    title?: string;
    /**
     * An optional description for the history object.
     */
    description?: string;
    /**
     * The date and time when the history object was created.
     */
    timestamp: Date;
};

/**
 * Represents a history object with a key, title, description, and timestamp.
 */
export class HistoryObject implements AbstractHistoryObject, Params {
    public key: string;

    public description: string | undefined;

    public timestamp: Date;

    public isHistoryObject = true;

    constructor(key: string, description?: string) {
        this.key = key;
        this.description = description;
        this.timestamp = new Date();
    }

    public toJSON(): string {
        const object: Params = {
            key: this.key,
            description: this.description,
            timestamp: this.timestamp,
        };
        return JSON.stringify(object);
    }

    public fromJSON(json: string): void {
        const object = JSON.parse(json) as Partial<Params>;
        Object.assign(this, object);
    }
}
