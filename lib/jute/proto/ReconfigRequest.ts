/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import long from '../long';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  joiningServers?: ustring | string;
  leavingServers?: ustring | string;
  newMembers?: ustring | string;
  curConfigId?: long | Buffer;
};

type Value = {
  joiningServers: ustring;
  leavingServers: ustring;
  newMembers: ustring;
  curConfigId: long;
};

export default class ReconfigRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      joiningServers: new ustring(value.joiningServers),
      leavingServers: new ustring(value.leavingServers),
      newMembers: new ustring(value.newMembers),
      curConfigId: new long(value.curConfigId),
    };

    super([
      { name: 'joiningServers', value: newValue.joiningServers },
      { name: 'leavingServers', value: newValue.leavingServers },
      { name: 'newMembers', value: newValue.newMembers },
      { name: 'curConfigId', value: newValue.curConfigId },
    ]);

    this._value = newValue;
  }

  get joiningServers() {
    return this._value.joiningServers.valueOf();
  }

  set joiningServers(value) {
    this._value.joiningServers.setValue(value);
  }

  get leavingServers() {
    return this._value.leavingServers.valueOf();
  }

  set leavingServers(value) {
    this._value.leavingServers.setValue(value);
  }

  get newMembers() {
    return this._value.newMembers.valueOf();
  }

  set newMembers(value) {
    this._value.newMembers.setValue(value);
  }

  get curConfigId() {
    return this._value.curConfigId.valueOf();
  }

  set curConfigId(value) {
    this._value.curConfigId.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      joiningServers: this.joiningServers,
      leavingServers: this.leavingServers,
      newMembers: this.newMembers,
      curConfigId: this.curConfigId,
    };
  }

}
