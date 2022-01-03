/**
 * @module express-log4js
 * @author dkrypt <dkrypt@dkrypt.in>
 * @description Express-Log4js, if described in one line is an
 * express middleware for logging http requests.
 * Behind the scenes it uses [Log4Js]{@link https://log4js-node.github.io/log4js-node/index.html}.
 * @exports pluginConfig
 * @exports expressMiddleware
 */
module.exports = {
  expressMiddleware: require('./express-logger-middleware'),
  getConfig: require('./log4js-plugin').getConfig
};
