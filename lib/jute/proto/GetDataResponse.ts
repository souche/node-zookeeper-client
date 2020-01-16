/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import buffer from '../buffer';
import Stat from '../data/Stat';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  data?: buffer | Buffer;
  stat?: Stat;
};

type Value = {
  data: buffer;
  stat: Stat;
};

export default class GetDataResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      data: new buffer(value.data),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'data', value: newValue.data },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get data() {
    return this._value.data.valueOf();
  }

  set data(value) {
    this._value.data.setValue(value);
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
      data: this.data,
      stat: this.stat,
    };
  }

}
