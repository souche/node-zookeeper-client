/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import Id from './Id';

import object from '../basic/object';

type ParamValue = {
  perms?: int | number;
  id?: Id;
};

type Value = {
  perms: int;
  id: Id;
};

export default class ACL extends object {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      perms: new int(value.perms),
      id: new Id(value.id),
    };

    super([
      { name: 'perms', value: newValue.perms },
      { name: 'id', value: newValue.id },
    ]);

    this._value = newValue;
  }

  get perms() {
    return this._value.perms.valueOf();
  }

  set perms(value) {
    this._value.perms.setValue(value);
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
      perms: this.perms,
      id: this.id,
    };
  }

}
