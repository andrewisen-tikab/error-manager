import { describe, it, expect } from 'vitest';
import { HistoryObject } from './HistoryObject';

describe('HistoryObject', () => {
    it('should create an instance with key and description', () => {
        const key = 'testKey';
        const description = 'testDescription';
        const historyObject = new HistoryObject(key, description);

        expect(historyObject.key).toBe(key);
        expect(historyObject.description).toBe(description);
        // expect(historyObject.timestamp).toBeInstanceOf(Date);
        expect(historyObject.isHistoryObject).toBe(true);
    });

    it('should create an instance with key and without description', () => {
        const key = 'testKey';
        const historyObject = new HistoryObject(key);

        expect(historyObject.key).toBe(key);
        expect(historyObject.description).toBeUndefined();
        // expect(historyObject.timestamp).toBeInstanceOf(Date);
        expect(historyObject.isHistoryObject).toBe(true);
    });

    it('should convert to JSON string', () => {
        const key = 'testKey';
        const description = 'testDescription';
        const historyObject = new HistoryObject(key, description);
        const json = historyObject.toJSON();

        const parsed = JSON.parse(json);
        expect(parsed.key).toBe(key);
        expect(parsed.description).toBe(description);
        // expect(new Date(parsed.timestamp)).toBeInstanceOf(Date);
    });

    it('should populate from JSON string', () => {
        const key = 'testKey';
        const description = 'testDescription';
        const timestamp = new Date();
        const json = JSON.stringify({ key, description, timestamp });

        const historyObject = new HistoryObject('dummyKey');
        historyObject.fromJSON(json);

        expect(historyObject.key).toBe(key);
        expect(historyObject.description).toBe(description);
        // expect(historyObject.timestamp).toEqual(new Date(timestamp));
    });
});
