/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import ustring from '../ustring';
import buffer from '../buffer';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  type?: int | number;
  scheme?: ustring | string;
  auth?: buffer | Buffer;
};

type Value = {
  type: int;
  scheme: ustring;
  auth: buffer;
};

export default class AuthPacket extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      type: new int(value.type),
      scheme: new ustring(value.scheme),
      auth: new buffer(value.auth),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'scheme', value: newValue.scheme },
      { name: 'auth', value: newValue.auth },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get scheme() {
    return this._value.scheme.valueOf();
  }

  set scheme(value) {
    this._value.scheme.setValue(value);
  }

  get auth() {
    return this._value.auth.valueOf();
  }

  set auth(value) {
    this._value.auth.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      type: this.type,
      scheme: this.scheme,
      auth: this.auth,
    };
  }

}
