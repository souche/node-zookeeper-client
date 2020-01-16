/**
 * xiedacon created at 2019-06-03 14:49:05
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

export * from './lib/constants';
import jute from './lib/jute';

import Client, { Options, Logger, Watcher } from './lib/Client';
import ConnectionManager from './lib/ConnectionManager';
import PacketManager from './lib/PacketManager';
import WatcherManager from './lib/WatcherManager';

import Exception from './lib/Exception';
import Packet from './lib/Packet';
import Request from './lib/Request';
import Response from './lib/Response';

import Transaction from './lib/Transaction';
import TransactionRequest from './lib/TransactionRequest';
import TransactionResponse from './lib/TransactionResponse';

import Shell from './lib/Shell';

export {
  jute,

  Client,
  Options,
  Logger,
  Watcher,
  ConnectionManager,
  PacketManager,
  WatcherManager,

  Exception,
  Packet,
  Request,
  Response,

  Transaction,
  TransactionRequest,
  TransactionResponse,

  Shell,
};

export function createClient(connectionString: string | Array<string>, options?: Options) {
  return new Client(connectionString, options);
}
