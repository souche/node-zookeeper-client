/**
 * xiedacon created at 2019-05-28 16:24:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import jute from './jute';

/**
 * This class represent the response that ZooKeeper sends back to the client.
 */
export default class Response<Payload extends Jute.basic.ResponseRecord> {
  header: Jute.proto.ReplyHeader;
  payload: Payload;
  chrootPath: string;

  /**
   *
   * @param payload The response payload record.
   */
  constructor(payload: Payload) {
    this.header = new jute.proto.ReplyHeader();
    this.payload = payload;
    this.chrootPath = '';
  }

  setChrootPath(path: string) {
    this.chrootPath = path;
  }

  fromBuffer(buffer: Buffer, offset = 0) {
    if (this.chrootPath) this.payload.setChrootPath(this.chrootPath);

    let bytesRead = 0;
    bytesRead += this.header.deserialize(buffer, offset + bytesRead);
    bytesRead += this.payload.deserialize(buffer, offset + bytesRead);

    return bytesRead;
  }

}
