# express-log4js
> express middleware for logging requests using log4js behind the scenes. Users can also extend for their implementation of log4js, if used as logger for your app.

## Install
```shell
$ npm install express-log4js
```

## Usage
```js
const {getConfig, expressMiddleware} = require('express-log4js');
const log4js = require('log4js');
const express = require('express');
const merge = require('merge');

const log4jsOptions = {
  appenders: {
    app: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['app'],
      level: 'info'
    }
  }
};
log4js.configure(merge(log4jsOptions, getConfig()));

const app = express();
app.use(expressMiddleware(log4js));
...
```
