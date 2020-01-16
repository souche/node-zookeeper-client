/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  version?: int | number;
};

type Value = {
  path: ustring;
  version: int;
};

export default class CheckVersionRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      version: new int(value.version),
    };

    super([
      { name: 'path', value: newValue.path },
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
      version: this.version,
    };
  }

}
