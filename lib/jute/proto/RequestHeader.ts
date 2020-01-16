/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  xid?: int | number;
  type?: int | number;
};

type Value = {
  xid: int;
  type: int;
};

export default class RequestHeader extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      xid: new int(value.xid),
      type: new int(value.type),
    };

    super([
      { name: 'xid', value: newValue.xid },
      { name: 'type', value: newValue.type },
    ]);

    this._value = newValue;
  }

  get xid() {
    return this._value.xid.valueOf();
  }

  set xid(value) {
    this._value.xid.setValue(value);
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      xid: this.xid,
      type: this.type,
    };
  }

}
