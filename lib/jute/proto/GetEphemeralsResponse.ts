/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import vector from '../vector';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  ephemerals?: vector<string> | Array<string>;
};

type Value = {
  ephemerals: vector<string>;
};

export default class GetEphemeralsResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      ephemerals: new vector(value.ephemerals, ustring),
    };

    super([
      { name: 'ephemerals', value: newValue.ephemerals },
    ]);

    this._value = newValue;
  }

  get ephemerals() {
    return this._value.ephemerals.valueOf();
  }

  set ephemerals(value) {
    this._value.ephemerals.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      ephemerals: this.ephemerals,
    };
  }

}
