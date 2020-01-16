/**
 * xiedacon created at 2019-05-27 16:57:17
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import * as _ from 'lodash';
import * as util from 'util';

import {
  ExceptionCode,
} from './constants';

const codeToName = _.invert(ExceptionCode);

export default class Exception extends Error {
  args: Array<any>;
  code: number;

  /**
   * Exception class for all zookeeper errors.
   *
   * @param name Exception code.
   * @param args Name of the exception.
   */
  constructor(name: string, ...args: Array<any>) {
    super();

    this.name = name;
    this.args = args;

    let code: number;
    let type: string;
    let message: string;
    let value: any;
    let path: string;
    switch (name) {
      case 'TypeError':
        [ type, value ] = args;
        this.message = `[${type}] must be a ${type}, get a ${typeof value === 'object' ? Object.prototype.toString.call(value) : typeof value}, value: ${util.inspect(value)}`;
        break;
      case 'ProtocolError':
        [ code, path ] = args;
        this.code = code;
        this.message = `${codeToName[String(code)] || ''} [${code}] ${path || ''}`;
        break;
      default:
        [ message ] = args;
        this.message = message;
        break;
    }
  }

  static get Type(): new (type: string, value: any) => Exception {
    return Exception.bind(null, 'TypeError');
  }

  static get Protocol(): new (code: number, path?: string) => Exception {
    return Exception.bind(null, 'ProtocolError');
  }

  static get Unknow(): new (message: string) => Exception {
    return Exception.bind(null, 'UnknowError');
  }

  static get Normal(): new (message: string) => Exception {
    return Exception.bind(null, 'NormalError');
  }

  toString() {
    return this.message;
  }

}
