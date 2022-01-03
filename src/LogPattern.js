'use strict';

const date = '%d{yyyy-MM-dd:hh.mm.ss.SSS}';
const id = '%X{id}';
const method = '%X{method}';
const url = '%X{url}';
const httpv = '%X{http-version}';
const auth = '%X{auth}';
const status = '%X{status}';

/**
 * @class LogPattern
 * @description creates a new LogPattern class instance
 */
class LogPattern {
  /**
   * returns log pattern for detail type
   * @return {String} detail log pattern
   */
  detail() {
    return `${date} [%c] (id: ${id}) REQ = [ %X{remoteAdd}, `+
    `"${method} ${url} HTTPv ${httpv}", auth: ${auth} `+
    `session: %X{session_id}], RES=[status: ${status}, `+
    `response_time: %X{res_time}, total_time: %X{total_time}]`;
  };
  /**
   * returns log pattern for short type
   * @return {String} short log pattern
   */
  short() {
    return `${date} [%c] (id: ${id}) %X{remoteAdd}, `+
    `"${method} ${url} HTTPv ${httpv}, `+
    `status: ${status}, response_time: %X{res_time}`;
  };
  /**
   * return log pattern for dev type
   * @return {String} dev log pattern
   */
  dev() {
    return `${date} [%c] (id: ${id}) %X{remoteAdd}, `+
    `"${method} ${url}", auth: ${auth} status: ${status}, `+
    `response_time: %X{res_time}, total_time: %X{total_time}]`;
  }
  /**
   * returns log pattern for requestBody
   * @return {String} requestBody log pattern
   */
  requestBody() {
    return '%d{yyyy-MM-dd:hh.mm.ss.SSS} [ %c ]'+
    ' # REQ = [id: %X{id}] : %m';
  }
}
module.exports = LogPattern;
