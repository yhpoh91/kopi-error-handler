# Kopi Error Handler
This library is used to save time for reimplementing express not found and error handler, along with a nice and pretty method to return an error response with a proper error structure.

## Installation
Using `npm`:
```npm install --save kopi-error-handler```

## Usage (express)
```
const KopiErrorHandler = require('kopi-error-handler');

const app = express();
app.use(KopiErrorHandler.handleNotFound);
app.use(KopiErrorHandler.handleError);
```

## Usage (create a custom error)
```
const KopiErrorHandler = require('kopi-error-handler');

const error = KopiErrorHandler.create({
  code: 404,
  status: 'Not Found',
  message: 'custom message',
  data: { someKey: 'some value' },
  stackTrace: true,
});
throw error;
```

### Configurations

`code`: (integer, optional, default: `500`) HTTP status code.

`status`: (string, optional, default: `mapped from code`) Message text, used if no message.

`message`: (string, optional) Error message text, overwriting message from JavaScript Error object.

`data`: (error/object, optional) main body of error.

`stackTrace`: (boolean, optional, default: `false`) Flag to include stacktrace.


### Environment Variables

`ERROR_HANDLER_LOG_NOT_FOUND_ROUTE`: (boolean, optional, default: `false`) Logs not found route

`ERROR_HANDLER_LOG_ERROR`: (boolean, optional, default: `false`) Logs errors before responding
