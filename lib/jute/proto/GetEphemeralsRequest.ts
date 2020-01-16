/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  prefixPath?: ustring | string;
};

type Value = {
  prefixPath: ustring;
};

export default class GetEphemeralsRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      prefixPath: new ustring(value.prefixPath),
    };

    super([
      { name: 'prefixPath', value: newValue.prefixPath },
    ]);

    this._value = newValue;
  }

  get prefixPath() {
    return this._value.prefixPath.valueOf();
  }

  set prefixPath(value) {
    this._value.prefixPath.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      prefixPath: this.prefixPath,
    };
  }

}
