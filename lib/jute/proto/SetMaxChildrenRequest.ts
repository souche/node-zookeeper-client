/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  max?: int | number;
};

type Value = {
  path: ustring;
  max: int;
};

export default class SetMaxChildrenRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      max: new int(value.max),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'max', value: newValue.max },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get max() {
    return this._value.max.valueOf();
  }

  set max(value) {
    this._value.max.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
      max: this.max,
    };
  }

}
