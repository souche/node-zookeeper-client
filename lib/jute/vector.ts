/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import Exception from '../Exception';

import Type from './basic/type';

export default class vector<T> extends Type {
  private type: typeof Type;
  private value: Array<Type>;

  constructor(value: vector<T> | Array<T> = [], type: typeof Type) {
    super();

    this.type = type;
    this.setValue(value);
  }

  byteLength() {
    let length = 4;

    if (Array.isArray(this.value)) {
      for (const value of this.value) {
        length += value.byteLength();
      }
    }

    return length;
  }

  serialize(buffer: Buffer, offset: number) {
    let bytesWritten = 4;

    if (Array.isArray(this.value)) {
      const length = this.value.length;
      buffer.writeInt32BE(length, offset);

      for (const value of this.value) {
        bytesWritten += value.serialize(buffer, offset + bytesWritten);
      }
    } else {
      buffer.writeInt32BE(-1, offset);
    }

    return bytesWritten;
  }

  deserialize(buffer: Buffer, offset: number) {
    const length = buffer.readInt32BE(offset);
    let bytesRead = 4;

    if (length === -1) {
      this.value = [];
    } else {
      this.value = [];
      while (length > this.value.length) {
        const value = new this.type();
        bytesRead += value.deserialize(buffer, offset + bytesRead);

        this.value.push(value);
      }
    }

    return bytesRead;
  }

  setValue(value: vector<T> | Array<T> = []) {
    const newValue = value instanceof Type ? value.valueOf() : value;

    if (!Array.isArray(newValue)) throw new Exception.Type('Array', value);

    this.value = newValue.map(v => new this.type(v));
  }

  clear() {
    this.value = [];
  }

  valueOf(): Array<T> {
    return this.value.map(v => v.valueOf());
  }

}
