/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import vector from '../vector';
import Stat from '../data/Stat';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  children?: vector<string> | Array<string>;
  stat?: Stat;
};

type Value = {
  children: vector<string>;
  stat: Stat;
};

export default class GetChildren2Response extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      children: new vector(value.children, ustring),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'children', value: newValue.children },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get children() {
    return this._value.children.valueOf();
  }

  set children(value) {
    this._value.children.setValue(value);
  }

  get stat() {
    return this._value.stat.valueOf();
  }

  set stat(value) {
    this._value.stat.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      children: this.children,
      stat: this.stat,
    };
  }

}
