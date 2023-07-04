const config = require('config');
const correlator = require('express-correlation-id');
const cors = require('cors');
const express = require('express');
const logger = require('./utils/logger');
const routes = require('./routes');
const sanitizer = require('sanitizer');
const mongoose = require('mongoose');

const app = express();
const portNumber = config.get('port');

app.use(express.json());
app.use(correlator());

const mongoURL = 'mongodb://127.0.0.1:27017/research';

mongoose.connect(mongoURL, {
  useNewUrlParser: true
}).then(() => { logger.info('connected to database'); })
.catch((e) => logger.error(e));

app.use((req, res, next) => {
  const baseLogObject = {
    headers: req.headers,
    method: req.method,
    query: req.query,
    requestId: req.headers.correlationid || sanitizer.escape(req.correlationId()),
    uri: req.path,
    route: req.path
  };

  // inbound requests
  logger.info('Inbound Started', {
    ...baseLogObject
  });

  res.on('finish', () => {
    logger.info('Inbound Completed', {
      ...baseLogObject,
      requestId: req.headers.correlationid || sanitizer.escape(req.correlationId()),
      statusCode: res.statusCode
    });
  });

  next();
});

app.use(cors());

app.use('/*', (req, res, next) => {
  res.set('correlation-id', req.headers.correlationid || sanitizer.escape(req.correlationId()));

  next();
});

app.use('/', routes);

// Fallback route handlers for any unmatched paths
app.use('/*', (req, res, next) => {
  const message = `${req.path} not found`;
  const error = new Error(message);
  error.statusCode = 404;
  error.errorWasLogged = (req.path === '/');
  next(error);
});

app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let error = err.message;
  const message = `Unable to retrieve ${sanitizer.escape(req.path)}`;
  const customErrorCode = err.customErrorCode;

  if (!err.errorWasLogged) {
    logger.error({
      errorDesc: (err && err.message) || 'Error retrieving data',
      stack: err.stack,
      headers: req.headers,
      method: req.method,
      query: req.query,
      requestId: req.headers.correlationid || req.correlationId(),
      uri: req.path,
      route: req.path,
      statusCode: err.statusCode
    });
  }

  // Do not change statusCode 400 for controller-created Bad Request errors
  if ((err.statusCode === 400) && (err.message && !err.message.includes('Bad Request'))) {
    // Convert downstream 400s to 404, else send 500
    const notFoundStatusCodes = [400, 404];
    statusCode = notFoundStatusCodes.includes(err.statusCode) ? 404 : 500;

    const internalError = `internal error: correlation-id ${sanitizer.escape(req.correlationId())}`;
    const notFoundError = `not found: correlation-id ${sanitizer.escape(req.correlationId())}`;

    error = statusCode === 404 ? notFoundError : internalError;
  }
  res.header('correlation-id', sanitizer.escape(req.correlationId())).status(statusCode);
  res.send({
    message, statusCode, error, customErrorCode
  });
});

const server = app.listen(
  portNumber,
  () => logger.info(`Log In API is listening on port ${portNumber}`)
);

// Export the server to allow for unit testing
module.exports = server;
