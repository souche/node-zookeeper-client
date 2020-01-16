/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ACL from '../data/ACL';
import vector from '../vector';
import Stat from '../data/Stat';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  acl?: vector<ACL> | Array<ACL>;
  stat?: Stat;
};

type Value = {
  acl: vector<ACL>;
  stat: Stat;
};

export default class GetACLResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      acl: new vector(value.acl, ACL),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'acl', value: newValue.acl },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get acl() {
    return this._value.acl.valueOf();
  }

  set acl(value) {
    this._value.acl.setValue(value);
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
      acl: this.acl,
      stat: this.stat,
    };
  }

}
