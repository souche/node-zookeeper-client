/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

/**
 * Interface for all jute types
 */
export default class Type {
  constructor(value?: any) {
    return this;
  }

  /**
   * Calculate and return the size of the buffer which is need to serialize this.
   */
  byteLength(): number {
    throw new Error('method must be implemented');
  }

  /**
   * Serialize the content to a buffer.
   *
   * @param buffer buffer
   * @param offset offset
   */
  serialize(buffer: Buffer, offset: number): number {
    throw new Error('method must be implemented');
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param buffer buffer
   * @param offset offset
   */
  deserialize(buffer: Buffer, offset: number): number {
    throw new Error('method must be implemented');
  }

  /**
   *
   * @param value
   */
  setValue(value: any) {
    throw new Error('method must be implemented');
  }

  clear() {
    throw new Error('method must be implemented');
  }

  valueOf(): any {
    throw new Error('method must be implemented');
  }

}
