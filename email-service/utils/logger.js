const isEmpty = require('lodash.isempty');
const pick = require('lodash.pick');
const _toString = require('lodash.tostring');
const os = require('os');
const util = require('util');
const pjson = require('../package.json');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Parser } = require('json2csv');

const HOSTNAME = os.hostname();
const VERSION = pjson.version;
const APP_NAME = pjson.name;
const ENV = process.env.NODE_ENV || 'development';

const logLevel = {
  DEBUG: 10,
  INFO: 20,
  WARN: 40,
  ERROR: 50,
  CRITICAL: 60
};

const flattenPayloads = (src, seen = []) => {
  if (Array.isArray(src)) {
    return src.map((item) => flattenPayloads(item, seen.concat(src)));
  }

  if (typeof (src) !== 'object') {
    return src;
  }

  if (!src) {
    return src;
  }

  const payloadKey = (src.payload && 'payload') || (src.Payload && 'Payload') || false;

  if (payloadKey) {
    const tempPayload = src[payloadKey];
    const stringifiedPayload = (typeof tempPayload === 'object') && JSON.stringify(tempPayload);
    const shortPayload = stringifiedPayload.length > 1000
      ? `${stringifiedPayload.substr(0, 1000)}...`
      : stringifiedPayload;
    return Object.assign({}, src, { [payloadKey]: shortPayload });
  }

  return Object.keys(src).reduce((res, key) => {
    res[key] = flattenPayloads(src[key]);
    return res;
  }, {});
};

const handleArgs = (arg) => {
  // Cast buffer to string and truncate if necessary
  if (Buffer.isBuffer(arg)) {
    const strPayload = arg.toString();
    const shortPayload = strPayload.length > 1000 ? `${strPayload.substr(0, 1000)}...` : strPayload;
    return shortPayload;
  }
  // Most logger.any( calls have a string as the first arg, used as the message
  const type = typeof (arg);
  if (type === 'string') {
    return {
      message: arg
    };
  }
  // Flatten objects and arrays
  if (type === 'object' || Array.isArray(arg)) {
    return flattenPayloads(arg);
  }
  // Else return the unchanged value
  return arg;
};

const reduceArgsToObject = (args) => {
  return args.reduce((acc, curr) => {
    if (!acc[curr]) {
      acc = Object.assign({}, acc, handleArgs(curr));
    }
    return acc;
  }, {});
};

const reformWebRequestArgObj = (args) => {
  return args.map((arg) => {
    if (!arg || typeof arg !== 'object' || arg instanceof Error) {
      return arg;
    }

    const {
      durationNS = '',
      errorDesc = '',
      headers,
      method,
      requestId,
      route,
      startTime,
      statusCode,
      uri,
      ...rest
    } = arg;

    const userAgent = pick(headers, 'user-agent');
    const referer = pick(headers, 'referer');
    const clientInfo = (!isEmpty(userAgent) || !isEmpty(referer)) && { ...userAgent, ...referer };

    const dataObject = {
      errorDesc,
      route,
      method,
      uri,
      statusCode,
      durationNS: _toString(durationNS),
      startTime: _toString(startTime),
      ...rest,
      clientInfo,
      correlationCurrentId: requestId,
      correlationOriginId: requestId
    };

    return Object.keys(dataObject).reduce((acc, curr) => {
      if (dataObject[curr]) {
        acc[curr] = dataObject[curr];
      }
      return acc;
    }, {});
  });
};


const logObject = (level, data) => {
  const dateTime = new Date();
  const reformedData = reformWebRequestArgObj(data);

  return {
    level: logLevel[level],
    levelName: level,
    dateTime: dateTime.toISOString(),
    container: HOSTNAME,
    env: ENV,
    epochTimestampNS: _toString(process.hrtime.bigint()),
    namespace: `${APP_NAME}-${ENV}`,
    resource: HOSTNAME,
    service: APP_NAME,
    version: VERSION,
    data: reduceArgsToObject(reformedData),
    correlationId: reduceArgsToObject(reformedData).correlationCurrentId
  };
};

const logType = (obj) => {
  return util.inspect(obj, { compact: true, colors: true, depth: 5 });
};

const writeToCSV = (data) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);
  const result = csv.substring(133);
  fs.appendFile('C:\\chanaka\\Research\\model\\logs.csv', result, 'utf-8', (err) => {
    if (err) console.log(err);
  });
};


module.exports = {
  debug: (...data) => {
    console.log(logType(logObject('DEBUG', data)));
    writeToCSV(logObject('DEBUG', data));
  },


  info: (...data) => {
    console.log(logType(logObject('INFO', data)));
    writeToCSV(logObject('INFO', data));
  },

  warn: (...data) => {
    console.log(logType(logObject('WARN', data)));
    writeToCSV(logObject('WARN', data));
  },

  error: (...data) => {
    if (data[data.length - 1] instanceof Error) {
      const error = data.pop();
      let errMsg = error.toString();
      if (error.stack) {
        errMsg = `${errMsg}\n${error.stack}`;
      }
      data.push(errMsg);
    }
    console.log(logType(logObject('ERROR', data)));
    writeToCSV(logObject('ERROR', data));
  },

  critical: (...data) => {
    console.log(logType(logObject('CRITICAL', data)));
    writeToCSV(logObject('CRITICAL', data));
  }
};
