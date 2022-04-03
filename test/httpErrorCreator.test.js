const httpErrorCreator = require('../src/httpErrorCreator');


test('should return error instance', () => {
  const httpError = httpErrorCreator.create({});

  expect(httpError instanceof Error).toBe(true);
});

test('should return error message', () => {
  const httpError = httpErrorCreator.create({ message: 'some message' });

  expect(httpError.message).toBe('some message');
});

test('should return name the same value as status', () => {
  const httpError = httpErrorCreator.create({ code: 403 });

  expect(httpError.name).toBe('Forbidden');
});

test('should have stack in root error', () => {
  const httpError = httpErrorCreator.create({ data: new Error() });

  expect(httpError.stack).not.toBeUndefined();
});

test('should have stack in root error when stacktrace false', () => {
  const httpError = httpErrorCreator.create({
    data: new Error(),
    stackTrace: false,
});

  expect(httpError.stack).not.toBeUndefined();
});

test('should have isKopiHttpError field', () => {
  const httpError = httpErrorCreator.create({});

  expect(httpError.isKopiHttpError).toBe(true);
});

test('config without code should default to 500', () => {
  const httpError = httpErrorCreator.create({});

  expect(httpError.code).toBe(500);
});

test('config with code should use specified code', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
  });

  expect(httpError.code).toBe(401);
});

test('config with proper code should have status text', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
  });

  expect(httpError.status).toBe('Unauthorized');
});

test('config with custom status should have custom status text', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    status: 'MyCustomStatus'
  });

  expect(httpError.status).toBe('MyCustomStatus');
});

test('config without custom message should have status message text', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error(),
  });

  expect(httpError.data.error.message).toBe('Unauthorized');
});

test('config without error message should have error message text', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error('something'),
  });

  expect(httpError.data.error.message).toBe('something');
});

test('config with custom message should have custom message text', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    message: 'my custom message',
    data: new Error('some error message'),
  });

  expect(httpError.data.error.message).toBe('my custom message');
});

test('config with data should have data', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: {
      item: 'value',
    },
  });

  expect(httpError.data.error.item).toEqual('value');
});

test('config with error should have error structure data', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error('some error message'),
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.name).toEqual('Error');
});

test('config with custom error should have error structure data', () => {
  function MyCustomError(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
  }

  const httpError = httpErrorCreator.create({
    code: 401,
    data: new MyCustomError('some custom error message')
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.message).toEqual('some custom error message');
});

test('config with stacktrace not configured should not have stack trace', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error(),
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.stack).toBeUndefined();
});

test('config with stacktrace disabled should not have stack trace', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error(),
    stackTrace: false,
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.stack).toBeUndefined();
});

test('config with stacktrace enabled should have stack trace when available', () => {
  const httpError = httpErrorCreator.create({
    code: 401,
    data: new Error(),
    stackTrace: true,
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.stack).not.toBeUndefined();
});

test('config with stacktrace enabled should not have stack trace when not available', () => {
  function MyCustomError(message) {
    this.constructor.prototype.__proto__ = Error.prototype;
    this.name = this.constructor.name;
    this.message = message;
  }

  const httpError = httpErrorCreator.create({
    code: 401,
    data: new MyCustomError(),
    stackTrace: true,
  });

  expect(httpError.data.error).not.toBeUndefined();
  expect(httpError.data.error.stack).toBeUndefined();
});


test('config should convert error into object with proper message', () => {
  try {
    const a = 1 + somethingNotExist;
  } catch (error) {

    const httpError = httpErrorCreator.create({
      data: error,
      stackTrace: true,
    });

    const newData = JSON.parse(JSON.stringify(httpError.data));

    expect(newData.error).not.toBeUndefined();
    expect(newData.error.name).toBe('ReferenceError');
    expect(newData.error.message).toBe('somethingNotExist is not defined');
    expect(newData.error.stack).not.toBeUndefined();
  }
});