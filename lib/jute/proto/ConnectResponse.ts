/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import int from '../int';
import long from '../long';
import buffer from '../buffer';

import ResponseRecord from '../basic/ResponseRecord';

type ParamValue = {
  protocolVersion?: int | number;
  timeOut?: int | number;
  sessionId?: long | Buffer;
  passwd?: buffer | Buffer;
};

type Value = {
  protocolVersion: int;
  timeOut: int;
  sessionId: long;
  passwd: buffer;
};

export default class ConnectResponse extends ResponseRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      protocolVersion: new int(value.protocolVersion),
      timeOut: new int(value.timeOut),
      sessionId: new long(value.sessionId),
      passwd: new buffer(value.passwd),
    };

    super([
      { name: 'protocolVersion', value: newValue.protocolVersion },
      { name: 'timeOut', value: newValue.timeOut },
      { name: 'sessionId', value: newValue.sessionId },
      { name: 'passwd', value: newValue.passwd },
    ]);

    this._value = newValue;
  }

  get protocolVersion() {
    return this._value.protocolVersion.valueOf();
  }

  set protocolVersion(value) {
    this._value.protocolVersion.setValue(value);
  }

  get timeOut() {
    return this._value.timeOut.valueOf();
  }

  set timeOut(value) {
    this._value.timeOut.setValue(value);
  }

  get sessionId() {
    return this._value.sessionId.valueOf();
  }

  set sessionId(value) {
    this._value.sessionId.setValue(value);
  }

  get passwd() {
    return this._value.passwd.valueOf();
  }

  set passwd(value) {
    this._value.passwd.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      protocolVersion: this.protocolVersion,
      timeOut: this.timeOut,
      sessionId: this.sessionId,
      passwd: this.passwd,
    };
  }

}
