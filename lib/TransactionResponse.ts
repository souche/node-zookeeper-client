/**
 * xiedacon created at 2019-05-28 16:27:46
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */


import {
  OpCode,
} from './constants';
import jute from './jute';
import Response from './Response';

export default class TransactionResponse extends Response<Jute.basic.ResponseRecord> {
  payloads: Array<Jute.basic.ResponseRecord | null> = [];

  constructor() {
    super(new jute.basic.EmptyResponseRecord());
  }

  setChrootPath(path: string) {
    this.chrootPath = path;
  }

  push(record: Jute.basic.ResponseRecord | null) {
    this.payloads.push(
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      new jute.proto.MultiHeader(),
      record
    );
  }

  fromBuffer(buffer: Buffer, offset = 0) {
    let bytesRead = 0;
    bytesRead += this.header.deserialize(buffer, offset + bytesRead);

    for (let i = 0; i < this.payloads.length; i++) {
      const record = this.payload[i];

      if (record) {
        if (this.chrootPath) {
          record.setChrootPath(this.chrootPath);
        }

        bytesRead += record.deserialize(buffer, offset + bytesRead);

        if (record instanceof jute.proto.MultiHeader && record.type === OpCode.error) {
          this.payload[i + 1] = new jute.proto.ErrorResponse();
        }
      }
    }

    return bytesRead;
  }

  [Symbol.iterator]() {
    const payloads = this.payloads;
    return (function* () {
      for (let i = 0; i < payloads.length; i += 2) {
        yield {
          // Forced type conversion just like Java
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          header: payloads[i] as Jute.proto.MultiHeader,
          payload: payloads[i + 1],
        };
      }
    })();
  }
}
