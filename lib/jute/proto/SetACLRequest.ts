/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import ACL from '../data/ACL';
import vector from '../vector';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  acl?: vector<ACL> | Array<ACL>;
  version?: int | number;
};

type Value = {
  path: ustring;
  acl: vector<ACL>;
  version: int;
};

export default class SetACLRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      acl: new vector(value.acl, ACL),
      version: new int(value.version),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'acl', value: newValue.acl },
      { name: 'version', value: newValue.version },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get acl() {
    return this._value.acl.valueOf();
  }

  set acl(value) {
    this._value.acl.setValue(value);
  }

  get version() {
    return this._value.version.valueOf();
  }

  set version(value) {
    this._value.version.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
      acl: this.acl,
      version: this.version,
    };
  }

}
