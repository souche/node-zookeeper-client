/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import type from './basic/type';

export default class int extends type {
  private value: number;

  constructor(value: int | number = 0) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 4;
  }

  serialize(buffer: Buffer, offset: number) {
    const bytesWritten = 4;

    if (typeof this.value === 'number') {
      buffer.writeInt32BE(this.value, offset);
    } else {
      buffer.writeInt32BE(0, offset);
    }

    return bytesWritten;
  }

  deserialize(buffer: Buffer, offset: number) {
    this.value = buffer.readInt32BE(offset);

    return 4;
  }

  setValue(value: int | number = 0) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (typeof this.value !== 'number') throw new Exception.Type('number', value);
  }

  clear() {
    this.value = 0;
  }

  valueOf() {
    return this.value;
  }

}
