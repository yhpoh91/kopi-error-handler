const express = require('express');
const http = require('http');

const KopiErrorHandler = require('./index');

const app = express();

// Setup handlers (put at the very end)
app.use((req, res, next) => KopiErrorHandler.handleNotFound(req, res, next));
app.use((error, req, res, next) => KopiErrorHandler.handleError(error, req, res, next));

const httpServer = http.createServer(app);
httpServer.listen(port);
