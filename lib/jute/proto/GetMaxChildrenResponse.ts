/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  max?: int | number;
};

type Value = {
  max: int;
};

export default class GetMaxChildrenResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      max: new int(value.max),
    };

    super([
      { name: 'max', value: newValue.max },
    ]);

    this._value = newValue;
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
      max: this.max,
    };
  }

}
