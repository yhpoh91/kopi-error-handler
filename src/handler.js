const httpErrorCreator = require('./httpErrorCreator');

const { L } = require('kopitech-logger')('Exception Handler');

const logNotFoundRoute = (process.env.ERROR_HANDLER_LOG_NOT_FOUND_ROUTE || 'false') === 'true';
const logError = (process.env.ERROR_HANDLER_LOG_ERROR || 'false') === 'true';

const handleNotFound = async (req, res, next) => {
  try {
    if (logNotFoundRoute) {
      const questionMarkIndex = req.originalUrl.indexOf('?');
      const hasQuery = questionMarkIndex >= 0;
      const route = hasQuery ? req.originalUrl.slice(0, questionMarkIndex) : req.originalUrl;

      L.info(`Not Found for Route "${route}"`);
    }

    const error404 = httpErrorCreator.create({ code: 404, stackTrace: false });
    next(error404);
  } catch (error) {
    const genericError = httpErrorCreator.create({ data: error });
    if (logError) {
      L.error(`Error in not found handling, wrapping in generic error`);
    }
    next(genericError);
  }
}

const handleError = async (error, req, res, next) => {
  try {
    let sanitizedError = error;

    if (sanitizedError.response) {
      // Handle Axios Response Error
      const { status, data } = sanitizedError.response;
      sanitizedError = httpErrorCreator.create({
        code: status,
        data,
      });
    } else if (sanitizedError.name === 'ValidationError') {
      // Handle Express Validation (joi) Error
      const { status, message } = sanitizedError;
      sanitizedError = httpErrorCreator.create({
        code: status,
        message,
        data: sanitizedError,
      });
    }

    

    if (!sanitizedError.isKopiHttpError) {
      sanitizedError = httpErrorCreator.create({ data: sanitizedError });
    }

    if (logError) {
      L.error(JSON.parse(JSON.stringify(sanitizedError)));
    }
    res.status(sanitizedError.code).json(sanitizedError.data);
  } catch (error) {
    const genericError = httpErrorCreator.create({ data: error });

    if (logError) {
      L.error(`Error in error handling, wrapping in generic error`);
      L.error(JSON.parse(JSON.stringify(genericError)));
    }
    res.status(genericError.code).json(genericError.data);
  }
};

module.exports = {
  handleNotFound,
  handleError,
}