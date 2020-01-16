/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import Stat from '../data/Stat';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  stat?: Stat;
};

type Value = {
  stat: Stat;
};

export default class ExistsResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      stat: new Stat(value.stat),
    };

    super([
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
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
      stat: this.stat,
    };
  }

}
