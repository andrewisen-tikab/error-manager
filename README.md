# Error Manager

The `ErrorManger` is an object that handles the application's `errors` and the user's `history`.

If, or when, the app crashes, the `errors` and `history` will be exported to a zip file.
This means that you, as a developer, can read the `errors` and `history` of the user and fix the bug.

No more guessing or vague descriptions of the error.

## Usage

```ts
import { ErrorManager } from 'error-manager';

// Create an instance of the ErrorManager
const errorManager = ErrorManager.Instance;
```

## License

MIT
