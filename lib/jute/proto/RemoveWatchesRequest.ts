/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  type?: int | number;
};

type Value = {
  path: ustring;
  type: int;
};

export default class RemoveWatchesRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      type: new int(value.type),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'type', value: newValue.type },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
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
      path: this.path,
      type: this.type,
    };
  }

}
