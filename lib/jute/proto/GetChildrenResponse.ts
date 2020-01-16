/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import vector from '../vector';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  children?: vector<string> | Array<string>;
};

type Value = {
  children: vector<string>;
};

export default class GetChildrenResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      children: new vector(value.children, ustring),
    };

    super([
      { name: 'children', value: newValue.children },
    ]);

    this._value = newValue;
  }

  get children() {
    return this._value.children.valueOf();
  }

  set children(value) {
    this._value.children.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      children: this.children,
    };
  }

}
