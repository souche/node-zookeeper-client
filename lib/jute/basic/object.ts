/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import type from './type';

/**
 * Abstract class for all jute object types
 */
export default class _object extends type {
  attrs: Array<{ name: string; value: type }>;

  constructor(value: Array<{ name: string; value: type }>) {
    super();

    this.attrs = value;
  }

  byteLength() {
    let length = 0;

    for (const attr of this.attrs) {
      length += attr.value.byteLength();
    }

    return length;
  }

  /**
   * Serialize the content to a buffer.
   *
   * @param buffer buffer
   * @param offset offset
   */
  serialize(buffer: Buffer, offset: number) {
    let bytesWritten = 0;

    for (const attr of this.attrs) {
      bytesWritten += attr.value.serialize(buffer, offset + bytesWritten);
    }

    return bytesWritten;
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param buffer buffer
   * @param offset offset
   */
  deserialize(buffer: Buffer, offset: number) {
    let bytesRead = 0;

    for (const attr of this.attrs) {
      bytesRead += attr.value.deserialize(buffer, offset + bytesRead);
    }

    return bytesRead;
  }

  setValue(value: any) {
    value = value instanceof type ? value.valueOf() : value;

    for (const attr of this.attrs) {
      attr.value.setValue(value[attr.name]);
    }
  }

  clear() {
    for (const attr of this.attrs) {
      attr.value.clear();
    }
  }

}
