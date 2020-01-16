/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import Stat from '../data/Stat';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  path?: ustring | string;
  stat?: Stat;
};

type Value = {
  path: ustring;
  stat: Stat;
};

export default class Create2Response extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
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
      path: this.path,
      stat: this.stat,
    };
  }

}
