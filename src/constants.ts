export const EVENT_TYPES = {
    /**
     * A generic error event.
     */
    ERROR: 'error',
    /**
     * A generic history event.
     */
    HISTORY: 'history',
    /**
     * Begin export event.
     */
    EXPORT_BEGIN: 'export-begin',
    /**
     * Export is done event.
     */
    EXPORT_DONE: 'export-done',
} as const;
