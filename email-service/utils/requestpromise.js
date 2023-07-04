const request = require('request');
const logger = require('./logger');

const DEFAULT_ERROR_MESSAGE = 'Error retrieving data';

const errorLogger = (body, overrideMessage, warnLevelStatusCodes, statusCode, logObject) => {
  // Set default log level to error
  let logLevel = 'error';

  // Check for any statusCodes the route would like to be excluded from error logging.
  let message = body && body.message ? body.message : overrideMessage || DEFAULT_ERROR_MESSAGE;
  if ([].concat(warnLevelStatusCodes).includes(statusCode)) {
    logLevel = 'warn';
    message = overrideMessage || body.message || DEFAULT_ERROR_MESSAGE;
  }

  // Log it
  logger[logLevel]({
    ...logObject,
    errorDesc: message
  });
};

const requestFunction = (externalUrl, options, requestId, method = 'GET', loggingOptions = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime.bigint();
    const { contextName, route } = loggingOptions;

    const baseLogObject = {
      contextName,
      headers: options.headers,
      method,
      requestId,
      uri: externalUrl,
      route: route || 'DEVELOPER WARNING: YOU DID NOT PROVIDE A ROUTE VALUE IN THE loggingOptions ARGUMENT'
    };

    logger.info('Outbound started: ', {
      ...baseLogObject,
      startTime
    });
    options.headers = {
      ...options.headers,
      'content-type': options.headers['content-type'] || 'application/json',
      'correlationId': requestId
    };
    options = Object.assign({}, options, {
      json: true,
      method,
      url: externalUrl
    });

    let logObject = {};

    request(options, (err, res, body) => {
      const endTime = process.hrtime.bigint();
      const durationNS = (endTime - startTime);
      const statusCode = res ? res.statusCode : null;
      logObject = {
        ...baseLogObject,
        durationNS,
        statusCode
      };

      if (err) {
        const errorDesc = err.message || DEFAULT_ERROR_MESSAGE;
        logger.error({
          ...logObject,
          errorDesc
        }, err);

        const error = new Error(errorDesc);
        error.statusCode = statusCode;

        return reject({ error, errorWasLogged: true });
      }

      // Get route-level overrides
      const { warnLevelStatusCodes, overrideMessage } = loggingOptions;

      if (statusCode >= 400 && statusCode < 500) {
        errorLogger(body, overrideMessage, warnLevelStatusCodes, statusCode, logObject);

        return reject({
          ...body,
          statusCode,
          errorWasLogged: true
        });
      } else if (statusCode >= 500) {
        errorLogger(body, overrideMessage, warnLevelStatusCodes, statusCode, logObject);
      }

      logger.info('Outbound completed: ', { ...logObject, payload: body });

      resolve(body);
    });
  });
};

module.exports = {
  get: (externalUrl, token, requestId, loggingOptions) => {
    const options = {
      headers: {
        'authorization': token,
        'json': true
      }
    };
    return requestFunction(externalUrl, options, requestId, 'GET', loggingOptions);
  },

  patch: (externalUrl, options, requestId, loggingOptions) => {
    return requestFunction(externalUrl, options, requestId, 'PATCH', loggingOptions);
  },

  post: (externalUrl, options, requestId, loggingOptions) => {
    return requestFunction(externalUrl, options, requestId, 'POST', loggingOptions);
  },

  put: (externalUrl, options, requestId, loggingOptions) => {
    return requestFunction(externalUrl, options, requestId, 'PUT', loggingOptions);
  },

  delete: (externalUrl, options, requestId, loggingOptions) => {
    return requestFunction(externalUrl, options, requestId, 'DELETE', loggingOptions);
  }
};
