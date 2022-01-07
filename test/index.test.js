/* eslint-disable max-len */
const log4js = require('log4js');
const express = require('express');
const {assert} = require('chai');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// module under test
const {expressMiddleware, getConfig} = require('../src/index');

// helper methods
// const readStdout = () => readFileSync('./stdout', 'utf-8');

let index = 1;
const runTest = (name, fn) => {
  console.log(`test #${index} - `, name);
  fn();
  index += 1;
};
// runTest('Test logging for POST to console', () => {
//   const app = express();
//   const expressLogConfig = getConfig();
//   const defaultConfig = {
//     appenders: {
//       app: {
//         type: 'console'
//       }
//     },
//     categories: {
//       default: {
//         appenders: ['app'],
//         level: 'info'
//       }
//     }
//   };
//   log4js.configure(mergeDeep(defaultConfig, expressLogConfig));
//   app.use(express.json());
//   app.use(expressMiddleware(log4js));
//   app.post('/log-test', (req, res) => {
//     res.send('ok');
//   });
//   const writeStream = createWriteStream('./stdout', {encoding: 'utf-8'});
//   process.stdout.write = writeStream.write.bind(writeStream);
//   writeStream.on('close', () => console.log('closed writestream'));
//   const server = app.listen(8765, async () => {
//     const response = await fetch('http://localhost:8765/log-test', {method: 'POST', body: JSON.stringify({hello: 'world!'})});
//     const body = await response.text();
//     assert.equal(body, 'ok', `response should be "ok"`);
//     const log = readStdout();
//     console.log(log);
//     // const logPatternRegex = /\d{4}-\d{2}-\d{2}:\d{2}.\d{2}.\d{2}.\d{3}\s\[REQUEST\]\s\(id:\s[a-z A-Z 0-9]{16}\)\sREQ\s=\s\[.+\],\sRES=\[status:\s\d{3},\sresponse_time:\s\d{1,5}.\d{5,6},\stotal_time:\s\d{1,5}.\d{5,6}]/g;
//     // assert.isTrue(logPatternRegex.test(log), 'log should match the regex');
//     server.close();
//   });
// });
// runTest('Test logging for GET to console', () => {
//   const app = express();
//   const expressLogConfig = getConfig();
//   const defaultConfig = {
//     appenders: {
//       app: {
//         type: 'console'
//       }
//     },
//     categories: {
//       default: {
//         appenders: ['app'],
//         level: 'info'
//       }
//     }
//   };
//   log4js.configure(mergeDeep(defaultConfig, expressLogConfig));
//   app.use(express.json());
//   app.use(expressMiddleware(log4js));
//   app.get('/log-test', (req, res) => {
//     res.send('ok');
//   });
//   const writeStream = createWriteStream('./stdout', {encoding: 'utf-8'});
//   process.stdout.write = writeStream.write.bind(writeStream);
//   writeStream.on('close', () => console.log('closed writestream'));
//   const server = app.listen(8765, async () => {
//     const response = await fetch('http://localhost:8765/log-test');
//     const body = await response.text();
//     assert.equal(body, 'ok', `response should be "ok"`);
//     const log = readStdout();
//     const logPatternRegex = /\d{4}-\d{2}-\d{2}:\d{2}.\d{2}.\d{2}.\d{3}\s\[REQUEST\]\s\(id:\s[a-z A-Z 0-9]{16}\)\sREQ\s=\s\[.+\],\sRES=\[status:\s\d{3},\sresponse_time:\s\d{1,5}.\d{5,6},\stotal_time:\s\d{1,5}.\d{5,6}]/g;
//     assert.isTrue(logPatternRegex.test(log), 'log should match the regex');
//     server.close();
//     rmSync('./stdout', {force: true});
//   });
// });

runTest('Test logging for GET to file', () => {
  const app = express();
  const defaultConfig = {
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
  const expressLogConfig = getConfig({
    level: 'info',
    type: 'file',
    filename: './logs/test.log',
    pattern: 'detail'
  }, defaultConfig);
  // const finalConfig = mergeDeep(defaultConfig, expressLogConfig);
  // console.log(JSON.stringify(finalConfig, null, 2));
  log4js.configure(expressLogConfig);
  app.use(express.json());
  app.use(expressMiddleware(log4js));
  app.get('/log-test', (req, res) => {
    res.send('ok');
  });
  // const writeStream = createWriteStream('./stdout', {encoding: 'utf-8'});
  // process.stdout.write = writeStream.write.bind(writeStream);
  // writeStream.on('close', () => console.log('closed writestream'));
  const server = app.listen(8765, async () => {
    const response = await fetch('http://localhost:8765/log-test');
    const body = await response.text();
    assert.equal(body, 'ok', `response should be "ok"`);
    // const log = readStdout();
    // const logPatternRegex = /\d{4}-\d{2}-\d{2}:\d{2}.\d{2}.\d{2}.\d{3}\s\[REQUEST\]\s\(id:\s[a-z A-Z 0-9]{16}\)\sREQ\s=\s\[.+\],\sRES=\[status:\s\d{3},\sresponse_time:\s\d{1,5}.\d{5,6},\stotal_time:\s\d{1,5}.\d{5,6}]/g;
    // assert.isTrue(logPatternRegex.test(log), 'log should match the regex');
    server.close();
    // rmSync('./stdout', {force: true});
  });
});
