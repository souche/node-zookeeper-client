/**
 * xiedacon created at 2019-06-01 17:50:29
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import RequestRecord from './RequestRecord';
import ResponseRecord from './ResponseRecord';

/**
 * Mixin RequestRecord and ResponseRecord.
 */
export default class MixinRecord extends RequestRecord {

  /**
   * De-serialize the content from a buffer.
   *
   * @param buffer A buffer object.
   * @param offset The offset where the read starts.
   */
  deserialize(buffer: Buffer, offset: number) {
    return ResponseRecord.prototype.deserialize.call(this, buffer, offset);
  }

}
