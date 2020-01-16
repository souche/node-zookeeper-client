/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  err?: int | number;
};

type Value = {
  err: int;
};

export default class ErrorResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      err: new int(value.err),
    };

    super([
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
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
      err: this.err,
    };
  }

}
