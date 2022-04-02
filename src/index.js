const httpErrorCreator = require('./httpErrorCreator');
const handler = require('./handler');

module.exports = {
  create: httpErrorCreator.create,

  handleNotFound: handler.handleNotFound,
  handleError: handler.handleError,
};
