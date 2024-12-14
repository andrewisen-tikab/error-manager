import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ErrorObject } from './ErrorObject';
import StackTrace from 'stacktrace-js';

vi.mock('stacktrace-js');

describe('ErrorObject', () => {
    let errorObject: ErrorObject;

    beforeEach(() => {
        // @ts-ignore
        StackTrace.get.mockResolvedValue([
            { toString: () => 'stack frame 1' },
            { toString: () => 'stack frame 2' },
        ]);
        errorObject = new ErrorObject('error-key', 'An error occurred');
    });

    it('should create an instance of ErrorObject', () => {
        expect(errorObject).toBeInstanceOf(ErrorObject);
        expect(errorObject.key).toBe('error-key');
        expect(errorObject.description).toBe('An error occurred');
        // expect(errorObject.timestamp).toBeInstanceOf(Date);
        expect(errorObject.isErrorObject).toBe(true);
    });

    it('should generate a stack trace', async () => {
        await new Promise((resolve) => setTimeout(resolve, 0)); // wait for stack trace to be set
        expect(errorObject.stackTrace).toBe('stack frame 1\nstack frame 2');
    });

    it('should convert to JSON', async () => {
        await new Promise((resolve) => setTimeout(resolve, 0)); // wait for stack trace to be set
        const json = errorObject.toJSON();
        const parsed = JSON.parse(json);
        expect(parsed).toEqual({
            key: 'error-key',
            description: 'An error occurred',
            timestamp: errorObject.timestamp.toISOString(),
            stackTrace: 'stack frame 1\nstack frame 2',
        });
    });

    it('should populate from JSON', () => {
        const json = JSON.stringify({
            key: 'new-key',
            description: 'New description',
            timestamp: new Date().toISOString(),
            stackTrace: 'new stack trace',
        });
        errorObject.fromJSON(json);
        expect(errorObject.key).toBe('new-key');
        expect(errorObject.description).toBe('New description');
        // expect(errorObject.timestamp).toBeInstanceOf(Date);
        expect(errorObject.stackTrace).toBe('new stack trace');
    });
});
