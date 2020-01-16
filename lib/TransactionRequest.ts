/**
 * xiedacon created at 2019-05-28 16:30:32
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import * as _ from 'lodash';
import * as util from 'util';

import {
  OpCode,
} from './constants';
import jute from './jute';
import Request from './Request';

const recordProtoToOpCode = new Map<object, number>();
recordProtoToOpCode.set(jute.proto.CreateRequest.prototype, OpCode.create);
recordProtoToOpCode.set(jute.proto.DeleteRequest.prototype, OpCode.delete);
recordProtoToOpCode.set(jute.proto.SetDataRequest.prototype, OpCode.setData);
recordProtoToOpCode.set(jute.proto.CheckVersionRequest.prototype, OpCode.check);

function recordToOpCode(record: Jute.basic.RequestRecord) {
  let opCode = recordProtoToOpCode.get(Object.getPrototypeOf(record));

  if (opCode === undefined) {
    if (record instanceof jute.proto.CreateRequest) {
      opCode = OpCode.create;
    } else if (record instanceof jute.proto.DeleteRequest) {
      opCode = OpCode.delete;
    } else if (record instanceof jute.proto.SetDataRequest) {
      opCode = OpCode.setData;
    } else if (record instanceof jute.proto.CheckVersionRequest) {
      opCode = OpCode.check;
    } else {
      throw new Error(`Unsupport RequestRecord: ${_.get(Object.getPrototypeOf(record), [ 'constructor', 'name' ], util.inspect(record))}`);
    }
  }

  return opCode;
}

export default class TransactionRequest extends Request<Jute.basic.RequestRecord> {
  payloads: Array<Jute.basic.RequestRecord> = [];

  constructor() {
    super(OpCode.multi, new jute.basic.EmptyRequestRecord());
  }

  push(record: Jute.basic.RequestRecord) {
    this.payloads.push(
      new jute.proto.MultiHeader({
        type: recordToOpCode(record),
        done: false,
        err: -1,
      }),
      record
    );
  }

  /**
   * Serialize the request to a buffer.
   *
   * @return The buffer which contains the serialized request.
   */
  toBuffer() {
    // Signal the end of the ops.
    this.payloads.push(new jute.proto.MultiHeader({
      type: -1,
      done: true,
      err: -1,
    }));

    const payload = this.payloads.filter(Boolean);
    if (this.chrootPath) {
      for (const record of payload) {
        record.setChrootPath(this.chrootPath);
      }
    }

    // Needs 4 extra for the length field (Int32)
    const buffer = Buffer.alloc(4);
    const headerBuffer = this.header.serialize();
    const packetsBuffer = Buffer.concat(payload.map(packet => packet.serialize()));

    buffer.writeInt32BE(headerBuffer.length + packetsBuffer.length, 0);

    return Buffer.concat([
      buffer,
      headerBuffer,
      packetsBuffer,
    ]);
  }

}
