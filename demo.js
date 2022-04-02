const express = require('express');
const http = require('http');

const KopiErrorHandler = require('./index');

const app = express();

// Setup handlers (put at the very end)
app.use(KopiErrorHandler.handleNotFound);
app.use(KopiErrorHandler.handleError);

const httpServer = http.createServer(app);
httpServer.listen(port);
