/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import type from './type';
import ustring from '../ustring';
import vector from '../vector';
import _object from './object';

import Exception from '../../Exception';

function prependChroot(chrootPath: string, path: string) {
  return chrootPath
    ? path === '/'
      ? chrootPath
      : chrootPath + path
    : path;
}

export default class RequestRecord {
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
   * Serialize the content to a buffer.
   */
  serialize() {
    const attrs = this.realType.attrs;

    if (this.chrootPath) {
      this.realType.attrs = this.realType.attrs.map(({ name, value }) => {
        if (name === 'path') {
          value = new ustring(prependChroot(this.chrootPath, value.valueOf()));
        } else if (
          (name === 'dataWatches'
        || name === 'existWatches'
        || name === 'childWatches'
          ) && value instanceof vector
        ) {
          value = new vector(value.valueOf().map(path => prependChroot(this.chrootPath, path)), ustring);
        }

        return { name, value };
      });
    }

    const buffer = Buffer.alloc(this.realType.byteLength());
    this.realType.serialize(buffer, 0);
    this.realType.attrs = attrs;

    return buffer;
  }

  setValue(value: any) {
    this.realType.setValue(value);
  }

  clear() {
    this.chrootPath = '';
    this.realType.clear();
  }

}
