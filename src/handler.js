const httpErrorCreator = require('./httpErrorCreator');

const { L } = require('kopitech-logger')('Exception Handler');


const handleNotFound = async (req, res, next) => {
  try {
    const error404 = httpErrorCreator.create({ code: 404 });
    next(error404);
  } catch (error) {
    L.error(error);
    next(httpErrorCreator.create({ data: error }));
  }
}

const handleError = async (error, req, res, next) => {
  try {
    let sanitizedError = error;
    if (!sanitizedError.isKopiHttpError) {
      sanitizedError = httpErrorCreator.create({ data: error });
    }

    res.status(sanitizedError.code).json(sanitizedError.data);
  } catch (error) {
    const genericError = httpErrorCreator.create({ data: error });
    res.status(genericError.code).json(genericError.data);
  }
};

module.exports = {
  handleNotFound,
  handleError,
}