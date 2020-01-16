/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  totalNumber?: int | number;
};

type Value = {
  totalNumber: int;
};

export default class GetAllChildrenNumberResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      totalNumber: new int(value.totalNumber),
    };

    super([
      { name: 'totalNumber', value: newValue.totalNumber },
    ]);

    this._value = newValue;
  }

  get totalNumber() {
    return this._value.totalNumber.valueOf();
  }

  set totalNumber(value) {
    this._value.totalNumber.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      totalNumber: this.totalNumber,
    };
  }

}
