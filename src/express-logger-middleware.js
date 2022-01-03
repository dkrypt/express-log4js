// eslint-disable-next-line no-unused-vars
const express = require('express');
const onHeaders = require('on-headers');
const onFinished = require('on-finished');

/**
 * Generates a unique/random string. Only uses [a-z], [A-Z] and [0-9]
 * @param {Number} length length of string to generate
 * @return {String} unique/random string of specified length
 */
const generateUniqueId = (length) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz'+
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (!length || (length === 0)) {
    length = 8;
  }
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
};

module.exports = (log4js) => {
  const reqLogger = log4js.getLogger('REQUEST');
  const reqBodyLogger = log4js.getLogger('REQUEST_BODY');
  /**
   * Middleware function for express
   * @param {express.Request} req request
   * @param {express.Response} res response
   * @param {express.NextFunction} next next function
   */
  const middleware = (req, res, next) => {
    req = parseRequest(req);
    req._startAt = undefined;
    req._startTime = undefined;
    res._startAt = undefined;
    res._startTime = undefined;
    req._startAt = process.hrtime();
    req._startTime = new Date();

    reqLogger.addContext('id', req.id);
    reqBodyLogger.addContext('id', req.id);
    reqLogger.addContext('remoteAdd', getIp(req));
    reqLogger.addContext('method', req.method);
    reqLogger.addContext('url', req.url);
    if (req.isAuth) {
      reqLogger.addContext('auth', req.auth);
    }
    reqLogger.addContext('http-version', req.httpVersion);
    reqLogger.addContext('session_id', req.session?.id);

    const logRequest = () => {
      const resTime = getResponseTime(req, res);
      const totalTime = getTotalTime(req, res);
      reqLogger.addContext('res_time', resTime);
      reqLogger.addContext('total_time', totalTime);
      reqLogger.addContext('status', res.statusCode);
      reqLogger.log();
      if (req.method.toLowerCase() === 'post' && req.body) {
        reqBodyLogger.info(JSON.stringify(req.body));
      }
    };
    // event handler for response time
    onHeaders(res, () => {
      res._startAt = process.hrtime();
      res._startTime = new Date();
    });
    onFinished(res, logRequest);
    next();
  };
  const getResponseTime = (req, res) => {
    if (!req._startAt || !res._startAt) {
      return;
    }
    const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
              (res._startAt[1] - req._startAt[1]) * 1e-6;
    return ms.toFixed(5);
  };
  const getTotalTime = (req, res) => {
    if (!req._startAt || !res._startAt) {
      return;
    }
    // time elapsed from request start
    const elapsed = process.hrtime(req._startAt);
    // cover to milliseconds
    const ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6);
    return ms.toFixed(5);
  };
  /**
   * Returns IP of the client for incoming request.
   * @param {express.Request} req request
   * @return {String} IP of the request
   */
  const getIp = (req) => {
    return (
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
    );
  };
  /**
   * Parses request for metadata
   * @param {express.Request} req express request
   * @return {express.Request} modified express request object
   */
  const parseRequest = (req) => {
    req.isAuth = hasAuth(req);
    req.auth = getAuth(req);
    req.id = generateUniqueId(16);
    return req;
  };

  /**
   * Returns the available value of auth string
   * @param {express.Request} req express request
   * @return {String} Authorization header value from request
   */
  const getAuth = (req) => {
    return req.headers.authorization;
  };

  /**
   * Checks if incoming request has authrorization header
   * @param {express.Request} req express request
   * @return {Boolean} whether request has Authorization header or not
   */
  const hasAuth = (req) => {
    const isBasic = req.headers.authorization?.startsWith('Basic');
    const isBearer = req.headers.authorization?.startsWith('Bearer');
    return isBasic || isBearer;
  };
  return middleware;
};
