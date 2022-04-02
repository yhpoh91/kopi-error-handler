const httpStatusCodes = require('http-status-codes');

const create = ({ 
  code, 
  status,
  message,
  data, 
  stackTrace = false,
}) => {
  const httpError = new Error(message);
  httpError.isKopiHttpError = true;

  const sanitizedCode = 500;

  httpError.code = code || sanitizedCode;
  httpError.status = status || httpStatusCodes.getReasonPhrase(httpError.code);
  httpError.name = httpError.status;

  httpError.data = {
    error: data || {
      message: httpError.status,
    },
  };

  if (message) {
    httpError.data.error.message = message;
  } else if (!httpError.data.error.message) {
    httpError.data.error.message = httpError.status;
  }

  if (data instanceof Error) {
    httpError.stack = data.stack;
    if (!stackTrace) {
      delete httpError.data.error.stack;
    }
  }
  

  return httpError;
}

module.exports = {
  create,
};
