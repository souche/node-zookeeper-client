/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import _boolean from '../boolean';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  watch?: _boolean | boolean;
};

type Value = {
  path: ustring;
  watch: _boolean;
};

export default class ExistsRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      watch: new _boolean(value.watch),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'watch', value: newValue.watch },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get watch() {
    return this._value.watch.valueOf();
  }

  set watch(value) {
    this._value.watch.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
      watch: this.watch,
    };
  }

}
