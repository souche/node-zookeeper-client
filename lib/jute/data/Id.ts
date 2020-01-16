/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';

import object from '../basic/object';

type ParamValue = {
  scheme?: ustring | string;
  id?: ustring | string;
};

type Value = {
  scheme: ustring;
  id: ustring;
};

export default class Id extends object {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      scheme: new ustring(value.scheme),
      id: new ustring(value.id),
    };

    super([
      { name: 'scheme', value: newValue.scheme },
      { name: 'id', value: newValue.id },
    ]);

    this._value = newValue;
  }

  get scheme() {
    return this._value.scheme.valueOf();
  }

  set scheme(value) {
    this._value.scheme.setValue(value);
  }

  get id() {
    return this._value.id.valueOf();
  }

  set id(value) {
    this._value.id.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      scheme: this.scheme,
      id: this.id,
    };
  }

}
