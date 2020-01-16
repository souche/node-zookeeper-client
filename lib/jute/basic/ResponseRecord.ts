/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import type from './type';
import ustring from '../ustring';
import _object from './object';

import Exception from '../../Exception';

function removeChroot(chrootPath: string, path: string) {
  return chrootPath
    ? (path.substring(chrootPath.length) || '/')
    : path;
}

export default class ResponseRecord {
  private realType: _object;
  private chrootPath: string;

  constructor(value: Array<{ name: string; value: type }>) {
    this.realType = new _object(value);
    this.chrootPath = '';
  }

  setChrootPath(path: string) {
    if (typeof path !== 'string') throw new Exception.Type('string', path);

    this.chrootPath = path;
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param buffer A buffer object.
   * @param offset The offset where the read starts.
   */
  deserialize(buffer: Buffer, offset = 0) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('buffer must an instance of Node.js Buffer class.');
    }

    if (offset < 0 || offset >= buffer.length) {
      throw new Error(`offset: ${offset} is out of buffer range.`);
    }

    const bytesRead = this.realType.deserialize(buffer, offset);

    if (this.chrootPath) {
      this.realType.attrs = this.realType.attrs.map(({ name, value }) => {
        if (name === 'path') {
          value = new ustring(removeChroot(this.chrootPath, value.valueOf()));
        }

        return { name, value };
      });
    }

    return bytesRead;
  }

  setValue(value: any) {
    this.realType.setValue(value);
  }

  clear() {
    this.chrootPath = '';
    this.realType.clear();
  }

}

let MixinRecord;
const realHasInstance = Function.prototype[Symbol.hasInstance];
Object.defineProperty(ResponseRecord, Symbol.hasInstance, {
  value(object) {
    if (realHasInstance.call(this, object)) return true;
    if (this !== ResponseRecord) return false;
    if (!MixinRecord) MixinRecord = require('./MixinRecord');

    return object instanceof MixinRecord;
  },
});
