/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import type from './basic/type';

/**
 * Long is represented by a buffer of 8 bytes in big endian since
 * Javascript does not support native 64 integer.
 */
export default class long extends type {
  private value: Buffer;

  constructor(value: long | Buffer = Buffer.alloc(8)) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 8;
  }

  serialize(buffer: Buffer, offset: number) {
    const bytesWritten = 8;

    if (Buffer.isBuffer(this.value)) {
      this.value.copy(buffer, offset);
    } else {
      Buffer.alloc(8).copy(buffer, offset);
    }

    return bytesWritten;
  }

  deserialize(buffer: Buffer, offset: number) {
    this.value = Buffer.alloc(8);
    buffer.copy(this.value, 0, offset, offset + 8);

    return 8;
  }

  setValue(value: long | Buffer = Buffer.alloc(8)) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (!Buffer.isBuffer(this.value)) throw new Exception.Type('buffer', value);
  }

  clear() {
    this.value.fill(0);
  }

  valueOf() {
    return this.value;
  }

}
