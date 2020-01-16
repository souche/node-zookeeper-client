/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import type from './basic/type';

export default class ustring extends type {
  private value: string;

  constructor(value: ustring | string = '') {
    super();

    this.setValue(value);
  }

  byteLength() {
    let length = 4;

    if (typeof this.value === 'string') {
      length += Buffer.byteLength(this.value);
    }

    return length;
  }

  serialize(buffer: Buffer, offset: number) {
    let bytesWritten = 4;

    if (typeof this.value === 'string') {
      const length = Buffer.byteLength(this.value);
      buffer.writeInt32BE(length, offset);

      Buffer.from(this.value).copy(buffer, offset + bytesWritten);
      bytesWritten += length;
    } else {
      buffer.writeInt32BE(-1, offset);
    }

    return bytesWritten;
  }

  deserialize(buffer: Buffer, offset: number) {
    const length = buffer.readInt32BE(offset);
    let bytesRead = 4;

    if (length === -1) {
      this.value = '';
    } else {
      this.value = buffer.toString(
        'utf8',
        offset + bytesRead,
        offset + bytesRead + length
      );

      bytesRead += length;
    }

    return bytesRead;
  }

  setValue(value: ustring | string = '') {
    this.value = value instanceof type ? value.valueOf() : value;

    if (typeof this.value !== 'string') throw new Exception.Type('string', value);
  }

  clear() {
    this.value = '';
  }

  valueOf() {
    return this.value;
  }

}
