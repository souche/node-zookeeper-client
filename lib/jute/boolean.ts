/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import type from './basic/type';

export default class _boolean extends type {
  private value: boolean;

  constructor(value: boolean | _boolean = false) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 1;
  }

  serialize(buffer: Buffer, offset: number) {
    const bytesWritten = 1;

    buffer.writeUInt8(this.value ? 1 : 0, offset);

    return bytesWritten;
  }

  deserialize(buffer: Buffer, offset: number) {
    this.value = buffer.readUInt8(offset) === 1;

    return 1;
  }

  setValue(value: boolean | _boolean = false) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (typeof this.value !== 'boolean') throw new Exception.Type('boolean', value);
  }

  clear() {
    this.value = false;
  }

  valueOf() {
    return this.value;
  }

}
