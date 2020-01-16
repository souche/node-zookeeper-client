/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import _boolean from '../boolean';

import MixinRecord from '../basic/MixinRecord';

type ParamValue = {
  type?: int | number;
  done?: _boolean | boolean;
  err?: int | number;
};

type Value = {
  type: int;
  done: _boolean;
  err: int;
};

export default class MultiHeader extends MixinRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      type: new int(value.type),
      done: new _boolean(value.done),
      err: new int(value.err),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'done', value: newValue.done },
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get done() {
    return this._value.done.valueOf();
  }

  set done(value) {
    this._value.done.setValue(value);
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
      type: this.type,
      done: this.done,
      err: this.err,
    };
  }

}
