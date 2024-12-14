import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventDispatcher } from './EventDispatcher';
import { DispatcherEvent, Listener } from '../types';

describe('EventDispatcher', () => {
    let dispatcher: EventDispatcher;
    let event: DispatcherEvent;
    let listener: Listener;

    beforeEach(() => {
        dispatcher = new EventDispatcher();
        // @ts-ignore
        event = { type: 'testEvent' };
        // @ts-ignore
        listener = (e: DispatcherEvent) => {
            console.log(e.type);
        };
    });

    it('should add an event listener', () => {
        dispatcher.addEventListener(event.type, listener);
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(true);
    });

    it('should remove an event listener', () => {
        dispatcher.addEventListener(event.type, listener);
        dispatcher.removeEventListener(event.type, listener);
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(false);
    });

    it('should check for the presence of an event listener', () => {
        dispatcher.addEventListener(event.type, listener);
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(true);
        dispatcher.removeEventListener(event.type, listener);
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(false);
    });

    it('should remove all event listeners of a specific type', () => {
        dispatcher.addEventListener(event.type, listener);
        dispatcher.removeAllEventListeners(event.type);
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(false);
    });

    it('should remove all event listeners', () => {
        dispatcher.addEventListener(event.type, listener);
        dispatcher.removeAllEventListeners();
        expect(dispatcher.hasEventListener(event.type, listener)).toBe(false);
    });

    it('should dispatch an event to the listeners', () => {
        const mockListener = vi.fn();
        dispatcher.addEventListener(event.type, mockListener);
        dispatcher.dispatchEvent(event);
        expect(mockListener).toHaveBeenCalledWith(event);
    });
});
