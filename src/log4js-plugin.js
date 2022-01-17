/* eslint-disable max-len */

const {mergeDeep} = require('./utils');
const LogPattern = require('./LogPattern');

/**
 * @typedef {Object} PluginConfigOptions
 * @property {('file'|'console')} type appender type
 * @property {('info'|'debug'|'error'|'trace')} level log level
 * @property {('dev'|'short'|'detail')} pattern log pattern
 * @property {String} [filename] absolute path of log file
 */

/**
 * @typedef {Object} ExpressLog4jsConfig
 * @property {Object} appenders log4js appenders
 * @property {Object} appenders.req custom express appender
 * @property {('file'|'console')} appenders.req.type logger out type
 * @property {String} [appenders.req.filename] path to log file if type is file
 * @property {String} [appenders.req.maxLogSize] maximum size of log file before archiving
 * @property {String} [appenders.req.backups] number of backups to keep for log file
 * @property {Object} appenders.req.layout req appender layout
 * @property {'pattern'} appenders.req.layout.type appender layout type
 * @property {'String'} appenders.req.layout.pattern pattern for log statement
 * @property {Object} appenders.requestBody custom express request body appender
 * @property {('file'|'console')} appenders.requestBody.type logger out type
 * @property {String} [appenders.requestBody.filename] path to log file if type is file
 * @property {String} [appenders.requestBody.maxLogSize] maximum size of log file before archiving
 * @property {String} [appenders.requestBody.backups] number of backups to keep for log file
 * @property {Object} appenders.requestBody.layout requestBody appender layout
 * @property {'pattern'} appenders.requestBody.layout.type appender layout type
 * @property {'String'} appenders.requestBody.layout.pattern pattern for log statement
 * @property {Object} categories log4js appender categories
 * @property {Object} categories.REQUEST custom REQUEST category
 * @property {Array} categories.REQUEST.appenders appenders to be used for this category
 * @property {String} categories.REQUEST.level log level
 * @property {Object} categories.REQUEST_BODY custom REQUEST_BODY category
 * @property {Array} categories.REQUEST_BODY.appenders appenders to be used for this category
 * @property {String} categories.REQUEST_BODY.level log level
 */


/**
 * adds required config to your provided object, according to
 * the options provided
 * @param {PluginConfigOptions} options express-log4js options
 * @param {ExpressLog4jsConfig} [appConfig] application log4js config. If provided will be merged with express-log4js config
 * @return {ExpressLog4jsConfig} required log4js config
 */
const getConfig = (options, appConfig) => {
  if (!options) {
    options = getDefaultOptions();
  }
  const config = getDefaultConfig();
  switch (options.type) {
    case 'console':
      config.appenders.req.type = 'console';
      break;
    case 'file':
      config.appenders.req.type = 'file';
      config.appenders.req.filename = options.filename || './logs/access.log';
      config.appenders.req.maxLogSize = 1073741824;
      config.appenders.req.backups = 5;
      config.appenders.requestBody.type = 'file';
      config.appenders.requestBody.filename = options.filename || './logs/access.log';
      config.appenders.requestBody.maxLogSize = 1073741824;
      config.appenders.requestBody.backups = 5;
      break;
    default:
      config.appenders.req.type = 'console';
  }
  const logPattern = new LogPattern();
  switch (options.pattern) {
    case 'detail':
      config.appenders.req.layout.pattern = logPattern.detail();
      break;
    case 'dev':
      config.appenders.req.layout.pattern = logPattern.dev();
      break;
    case 'short':
      config.appenders.req.layout.pattern = logPattern.short();
      break;
    default:
      config.appenders.req.layout.pattern = logPattern.dev();
      break;
  }
  config.appenders.requestBody.layout.pattern = logPattern.requestBody();
  config.categories.REQUEST.level = options.level;
  config.categories.REQUEST_BODY.level = options.level;
  if (appConfig) {
    return mergeDeep(appConfig, config);
  }
  return config;
};

/**
 * returns default options
 * @return {PluginConfigOptions} default options
 */
const getDefaultOptions = () => {
  return {
    type: 'console',
    level: 'info',
    pattern: 'info'
  };
};

/**
 * returns default config for log4js
 * @return {ExpressLog4jsConfig}
 */
const getDefaultConfig = () => {
  return {
    appenders: {
      req: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: new LogPattern().detail()
        }
      },
      requestBody: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: new LogPattern().requestBody()
        }
      }
    },
    categories: {
      REQUEST: {
        appenders: ['req'],
        level: 'info'
      },
      REQUEST_BODY: {
        appenders: ['requestBody'],
        level: 'info'
      }
    }
  };
};

module.exports = {getConfig};
