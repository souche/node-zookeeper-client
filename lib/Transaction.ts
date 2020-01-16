/**
 * xiedacon created at 2019-05-27 16:58:55
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import {
  CreateMode,
  Ids,
  OpCode,
  ExceptionCode,
} from './constants';
import jute from './jute';
import * as utils from './utils';

import Exception from './Exception';

import Client from './Client';
import PacketManager from './PacketManager';
import ConnectionManager from './ConnectionManager';
import Packet from './Packet';
import TransactionRequest from './TransactionRequest';
import TransactionResponse from './TransactionResponse';

export default class Transaction {
  private showFriendlyErrorStack: boolean;
  private packetManager: PacketManager;
  private connectionManager: ConnectionManager;
  private packet: Packet<TransactionRequest, TransactionResponse>;

  /**
   * Transaction provides a builder interface that helps building an atomic set
   * of operations.
   *
   * @param client an instance of node-zookeeper-client.
   */
  constructor(client: Client) {
    this.showFriendlyErrorStack = client.options.showFriendlyErrorStack;
    this.packetManager = client.packetManager;
    this.connectionManager = client.connectionManager;

    this.packet = client.packetManager.multi;
  }

  /**
   * Add a create operation with given path, data, acls and mode.
   *
   * @param path The znode path.
   * @param data The data buffer.
   * @param acl An array of ACL object.
   * @param flags The creation mode.
   */
  create(path: string, data?: string | Buffer, acl = Ids.OPEN_ACL_UNSAFE, flags = CreateMode.PERSISTENT) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;

    this.packet.request.push(new jute.proto.CreateRequest({
      path,
      acl,
      flags,
      data,
    }));
    this.packet.response.push(new jute.proto.CreateResponse());

    return this;
  }

  /**
   * Add a check (existence) operation with given path and optional version.
   *
   * @param path The znode path.
   * @param version The version of the znode.
   */
  check(path: string, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    this.packet.request.push(new jute.proto.CheckVersionRequest({
      path,
      version,
    }));
    this.packet.response.push(null);

    return this;
  }

  /**
   * Add a set-data operation with the given path, data and optional version.
   *
   * @param path The znode path.
   * @param data The data buffer.
   * @param version The version of the znode.
   */
  setData(path: string, data?: string | Buffer, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;

    this.packet.request.push(new jute.proto.SetDataRequest({
      path,
      data,
      version,
    }));
    this.packet.response.push(new jute.proto.SetDataResponse());

    return this;
  }

  /**
   * Add a delete operation with the given path and optional version.
   *
   * @param path The znode path.
   * @param version The version of the znode.
   */
  remove(path: string, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    this.packet.request.push(new jute.proto.DeleteRequest({
      path,
      version,
    }));
    this.packet.response.push(null);

    return this;
  }

  /**
   * Execute the transaction atomically.
   */
  async commit() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (this.packet.request.payloads.length > 0) await this.connectionManager.send(this.packet);

    const result = [] as Array<{ header: { type: number; done: boolean; err: number }; payload: any }>;
    for (const { header, payload } of this.packet.response) {
      if (header.type === OpCode.error && header.err !== ExceptionCode.OK) throw new Exception.Protocol(header.err);

      result.push({
        header: header.valueOf(),
        payload: payload && payload.valueOf(),
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    this.packetManager.recyclePacket(this.packet);
    this.packet = this.packetManager.multi;

    return result;
  }

}
