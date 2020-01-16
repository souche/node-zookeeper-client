/**
 * xiedacon created at 2019-05-28 16:21:24
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import jute from './jute';

/**
 * This class represent the request the client sends over the wire to ZooKeeper
 * server.
 */
export default class Request<Payload extends Jute.basic.RequestRecord> {
  header: Jute.proto.RequestHeader;
  payload: Payload;
  chrootPath: string;

  /**
   * @param opCode The request opCode.
   * @param payload The request payload record.
   */
  constructor(opCode: number, payload: Payload) {
    this.chrootPath = '';
    this.header = Number.isNaN(opCode) ? new jute.basic.EmptyRequestHeader() : new jute.proto.RequestHeader({ type: opCode });
    this.payload = payload;
  }

  setChrootPath(path: string) {
    this.chrootPath = path;
  }

  /**
   * Serialize the request to a buffer.
   *
   * @return The buffer which contains the serialized request.
   */
  toBuffer() {
    if (this.chrootPath) this.payload.setChrootPath(this.chrootPath);

    // Needs 4 extra for the length field (Int32)
    const buffer = Buffer.alloc(4);
    const headerBuffer = this.header.serialize();
    const payloadBuffer = this.payload.serialize();

    buffer.writeInt32BE(headerBuffer.length + payloadBuffer.length, 0);

    return Buffer.concat([
      buffer,
      headerBuffer,
      payloadBuffer,
    ]);
  }

}
