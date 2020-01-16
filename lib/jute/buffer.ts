/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import type from './basic/type';

export default class buffer extends type {
  private value: Buffer;

  constructor(value: buffer | Buffer = Buffer.alloc(0)) {
    super();

    this.setValue(value);
  }

  byteLength() {
    let length = 4;

    if (Buffer.isBuffer(this.value)) {
      length += this.value.length;
    }

    return length;
  }

  serialize(buffer: Buffer, offset: number) {
    let bytesWritten = 4;

    if (Buffer.isBuffer(this.value)) {
      const length = this.value.length;
      buffer.writeInt32BE(length, offset);

      this.value.copy(buffer, offset + bytesWritten);
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
      this.value = Buffer.alloc(0);
    } else {
      buffer.copy(
        this.value = Buffer.alloc(length),
        0,
        offset + bytesRead,
        offset + bytesRead + length);

      bytesRead += length;
    }

    return bytesRead;
  }

  setValue(value: buffer | Buffer = Buffer.alloc(0)) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (!Buffer.isBuffer(this.value)) throw new Exception.Type('buffer', value);
  }

  clear() {
    this.value = Buffer.alloc(0);
  }

  valueOf() {
    return this.value;
  }

}
