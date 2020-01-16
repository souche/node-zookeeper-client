/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import buffer from '../buffer';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  token?: buffer | Buffer;
};

type Value = {
  token: buffer;
};

export default class SetSASLRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      token: new buffer(value.token),
    };

    super([
      { name: 'token', value: newValue.token },
    ]);

    this._value = newValue;
  }

  get token() {
    return this._value.token.valueOf();
  }

  set token(value) {
    this._value.token.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      token: this.token,
    };
  }

}
