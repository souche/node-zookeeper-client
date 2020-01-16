/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import buffer from '../buffer';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  data?: buffer | Buffer;
  version?: int | number;
};

type Value = {
  path: ustring;
  data: buffer;
  version: int;
};

export default class SetDataRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      data: new buffer(value.data),
      version: new int(value.version),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'data', value: newValue.data },
      { name: 'version', value: newValue.version },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get data() {
    return this._value.data.valueOf();
  }

  set data(value) {
    this._value.data.setValue(value);
  }

  get version() {
    return this._value.version.valueOf();
  }

  set version(value) {
    this._value.version.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
      data: this.data,
      version: this.version,
    };
  }

}
