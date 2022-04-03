require('regenerator-runtime/runtime');

const httpErrorCreator = require('../src/httpErrorCreator');
const errorHandler = require('../src/handler');

const createMockRequest = () => {
    const response = {};
    const req = {
      originalUrl: 'https://test.com?item1=123&item2=abc',
    };
    const res = {
      status: (s) => {
        response.status = s;
        return res;
      },
      json: d => response.data = d,
      send: d => response.data = d,
    }
    const next = (e) => response.error = e;

    return {
      response,

      req,
      res,
      next,
    };
}

test('not found handler should throw 404', async () => {
  const { req, res, next, response } = createMockRequest();

  await errorHandler.handleNotFound(req, res, next);

  expect(response.error).not.toBeUndefined();
  expect(response.error.code).toBe(404);
});

test('error handler should use 500 for generic error', async () => {
  const { req, res, next, response } = createMockRequest();
  const error = new Error();

  await errorHandler.handleError(error, req, res, next);

  expect(response.status).toBe(500);
  expect(response.data.error).not.toBeUndefined();
});

test('error handler should use correct code for kopi http error', async () => {
  const { req, res, next, response } = createMockRequest();
  const error = httpErrorCreator.create({ code: 401 });

  await errorHandler.handleError(error, req, res, next);

  expect(response.status).toBe(401);
  expect(response.data.error).not.toBeUndefined();
});


test('error handler should use correct data for kopi http error', async () => {
  const { req, res, next, response } = createMockRequest();
  const error = httpErrorCreator.create({
    code: 401,
    data: { 
      item: 'value',
    },
  });

  await errorHandler.handleError(error, req, res, next);

  expect(response.data.error.message).toBe('Unauthorized');
  expect(response.data.error.item).toBe('value');
});


test('error handler should handle axios response error', async () => {
  const { req, res, next, response } = createMockRequest();
  const error = new Error();
  error.response = {
    status: 401,
    data: {
      item: 'value',
    },
  };

  await errorHandler.handleError(error, req, res, next);

  expect(response.data.error.message).toBe('Unauthorized');
  expect(response.data.error.item).toBe('value');
});




test('error handler should handle joi validation error', async () => {
  const { req, res, next, response } = createMockRequest();

  // Joi Validation Error Sample
  const error = new Error();
  error.name = 'ValidationError';
  error.message = 'validation error';
  error.errors = [
    {
      "field": ["password"],
      "location": "body",
      "messages": ["\"password\" is required"],
      "types": ["any.required"]
    }
  ];
  error.status = 400;
  error.statusText = "Bad Request";

  await errorHandler.handleError(error, req, res, next);

  expect(response.status).toBe(400);
  expect(response.data.error.name).toBe('ValidationError');
  expect(response.data.error.message).toBe('validation error');
  expect(response.data.error.errors.length).toBe(1);
});


