/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import long from '../long';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  xid?: int | number;
  zxid?: long | Buffer;
  err?: int | number;
};

type Value = {
  xid: int;
  zxid: long;
  err: int;
};

export default class ReplyHeader extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      xid: new int(value.xid),
      zxid: new long(value.zxid),
      err: new int(value.err),
    };

    super([
      { name: 'xid', value: newValue.xid },
      { name: 'zxid', value: newValue.zxid },
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
  }

  get xid() {
    return this._value.xid.valueOf();
  }

  set xid(value) {
    this._value.xid.setValue(value);
  }

  get zxid() {
    return this._value.zxid.valueOf();
  }

  set zxid(value) {
    this._value.zxid.setValue(value);
  }

  get err() {
    return this._value.err.valueOf();
  }

  set err(value) {
    this._value.err.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      xid: this.xid,
      zxid: this.zxid,
      err: this.err,
    };
  }

}
