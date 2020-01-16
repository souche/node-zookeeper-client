/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import ustring from '../ustring';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  type?: int | number;
  state?: int | number;
  path?: ustring | string;
};

type Value = {
  type: int;
  state: int;
  path: ustring;
};

export default class WatcherEvent extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      type: new int(value.type),
      state: new int(value.state),
      path: new ustring(value.path),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'state', value: newValue.state },
      { name: 'path', value: newValue.path },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get state() {
    return this._value.state.valueOf();
  }

  set state(value) {
    this._value.state.setValue(value);
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
      type: this.type,
      state: this.state,
      path: this.path,
    };
  }

}
