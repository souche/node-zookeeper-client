/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  path?: ustring | string;
};

type Value = {
  path: ustring;
};

export default class CreateResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
    };

    super([
      { name: 'path', value: newValue.path },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
    };
  }

}
