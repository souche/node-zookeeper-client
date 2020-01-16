/**
 * xiedacon created at 2019-06-03 14:49:05
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import * as events from 'events';

import {
  CreateMode,
  OpCode,
  Xid,
  ExceptionCode,
  ConnectionEvent,
  Ids,
} from './constants';
import * as utils from './utils';
import Transaction from './Transaction';
import Exception from './Exception';
import Shell from './Shell';

import PacketManager from './PacketManager';
import ConnectionManager from './ConnectionManager';
import WatcherManager from './WatcherManager';

const isProd = process.env.NODE_ENV && [ 'dev', 'develop', 'development', 'DEV', 'DEVELOP', 'DEVELOPMENT' ].indexOf(process.env.NODE_ENV) < 0;

export interface Logger {
  error: Function;
  info: Function;
  warn: Function;
  debug: Function;
}

export interface Options {
  /**
   * scheme:auth information
   */
  authInfo: Array<{ scheme: string; auth: string | Buffer }>;
  configNode: string;
  /**
   * socket connect timeout
   */
  connectTimeout: number;
  /**
   * Time to wait after try all server failed
   */
  reconnectInterval: number;
  /**
   * Times to retry send packet to server
   */
  retries: number;
  /**
   * Time to wait before retry send
   */
  retryInterval: number;
  /**
   * Show friendly error stack
   */
  showFriendlyErrorStack: boolean;
  logger: Logger;
  PacketManager: typeof PacketManager;
  WatcherManager: typeof WatcherManager;
}

export type Watcher = (event: { type: number; state: number; path: string }) => any;

export default class Client extends events.EventEmitter {
  connectionString: string;
  options: Options;
  credentials = [] as Array<{ scheme: string; auth: Buffer }>;

  logger: Logger;
  shell: Shell;
  packetManager: PacketManager;
  connectionManager: ConnectionManager;
  watcherManager: WatcherManager;

  constructor(connectionString: string | Array<string>, options: Partial<Options> = {}) {
    super();

    if (Array.isArray(connectionString)) connectionString = connectionString.join(',');
    if (typeof connectionString !== 'string') throw new Exception.Normal('connectionString must be a string or Array<string>');

    this.connectionString = connectionString;
    this.options = Object.assign({}, this.default, options);

    // Disable on production
    this.options.showFriendlyErrorStack = isProd ? false : this.options.showFriendlyErrorStack;

    // scheme:auth pairs
    for (let { scheme, auth } of this.options.authInfo) {
      if (typeof auth === 'string') auth = Buffer.from(auth);
      if (typeof scheme !== 'string') throw new Exception.Normal('authInfo[i].scheme must be a string');
      if (!Buffer.isBuffer(auth)) throw new Exception.Normal('authInfo[i].auth must be a string or Buffer');

      this.credentials.push({ scheme, auth });
    }

    this.logger = this.options.logger;
    this.shell = new Shell(this);

    this.packetManager = this.options.PacketManager instanceof PacketManager
      ? new this.options.PacketManager(this)
      : new PacketManager(this);
    this.connectionManager = new ConnectionManager(this);
    this.watcherManager = this.options.WatcherManager instanceof WatcherManager
      ? new this.options.WatcherManager(this)
      : new WatcherManager(this);
  }

  get default() {
    return {
      authInfo: [],
      configNode: '/zookeeper/config',

      connectTimeout: 5000,
      reconnectInterval: 1000,

      retries: 3,
      retryInterval: 0,

      showFriendlyErrorStack: !isProd,

      logger: {
        error: console.log,
        info: console.log,
        warn: console.log,
        debug: console.log,
      },
      PacketManager,
      WatcherManager,
    };
  }

  async ready() {
    for (const event of Object.values(ConnectionEvent)) {
      this.connectionManager.on(event, (...args) => this.emit(event, ...args));
    }

    await this.packetManager.ready();
    await this.connectionManager.ready();
    await this.watcherManager.ready();

    this.connectionManager.on(ConnectionEvent.connect, () => {
      for (const credential of this.credentials) {
        const packet = this.packetManager.auth;
        packet.request.header.xid = Xid.authentication;
        packet.request.payload.setValue({
          type: 0, // ignored by the server
          scheme: credential.scheme,
          auth: credential.auth,
        });

        // Send inner-request without queue
        if (this.connectionManager.socket) this.connectionManager.socket.write(packet.request.toBuffer());

        this.packetManager.recyclePacket(packet);
      }
    });
  }

  /**
   * The session id for this ZooKeeper client instance. The value returned is
   * not valid until the client connects to a server and may change after a
   * re-connect.
   */
  getSessionId() {
    return this.connectionManager.sessionId;
  }

  /**
   * The session password for this ZooKeeper client instance. The value
   * returned is not valid until the client connects to a server and may
   * change after a re-connect.
   */
  getSessionPassword() {
    return this.connectionManager.sessionPassword;
  }

  /**
   * The negotiated session timeout for this ZooKeeper client instance. The
   * value returned is not valid until the client connects to a server and
   * may change after a re-connect.
   */
  getSessionTimeout() {
    return this.connectionManager.sessionTimeout;
  }

  /**
   * Start the client and try to connect to the ensemble.
   */
  async connect() {
    await this.ready();
    await this.connectionManager.connect();
  }

  /**
   * Close this client object. Once the client is closed, its session becomes
   * invalid. All the ephemeral nodes in the ZooKeeper server associated with
   * the session will be removed. The watches left on those nodes (and on
   * their parents) will be triggered.
   */
  async close() {
    this.removeAllListeners();

    await this.packetManager.close();
    await this.connectionManager.close();
    await this.watcherManager.close();

    await new Promise(resolve => {
      // await for other microtask, eg: watcherManager emit event
      setTimeout(() => {
        this.packetManager.clear();
        this.connectionManager.clear();
        this.watcherManager.clear();

        resolve();
      }, 0);
    });
  }

  /**
   * Create a node with the given path. The node data will be the given data,
   * and node acl will be the given acl.
   *
   * The flags argument specifies whether the created node will be ephemeral
   * or not.
   *
   * An ephemeral node will be removed by the ZooKeeper automatically when the
   * session associated with the creation of the node expires.
   *
   * The flags argument can also specify to create a sequential node. The
   * actual path name of a sequential node will be the given path plus a
   * suffix "i" where i is the current sequential number of the node. The sequence
   * number is always fixed length of 10 digits, 0 padded. Once
   * such a node is created, the sequential number will be incremented by one.
   *
   * If a node with the same actual path already exists in the ZooKeeper, a
   * KeeperException with error code KeeperException.NodeExists will be
   * thrown. Note that since a different actual path is used for each
   * invocation of creating sequential node with the same path argument, the
   * call will never throw "file exists" KeeperException.
   *
   * If the parent node does not exist in the ZooKeeper, a KeeperException
   * with error code KeeperException.NoNode will be thrown.
   *
   * An ephemeral node cannot have children. If the parent node of the given
   * path is ephemeral, a KeeperException with error code
   * KeeperException.NoChildrenForEphemerals will be thrown.
   *
   * This operation, if successful, will trigger all the watches left on the
   * node of the given path by exists and getData API calls, and the watches
   * left on the parent node by getChildren API calls.
   *
   * If a node is created successfully, the ZooKeeper server will trigger the
   * watches on the path left by exists calls, and the watches on the parent
   * of the node by getChildren calls.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperExecption to be thrown.
   *
   * @param path the path for the node
   * @param data the initial data for the node
   * @param acl the acl for the node
   * @param flags specifying whether the node to be created is ephemeral and/or sequential
   */
  async create(path: string, data?: string | Buffer, acl = Ids.OPEN_ACL_UNSAFE, flags = CreateMode.PERSISTENT) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;


    const packet = this.packetManager.create;
    packet.request.header.type = flags === CreateMode.CONTAINER ? OpCode.createContainer : OpCode.create;
    packet.request.payload.setValue({
      path,
      acl,
      flags,
      data,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Create a node with the given path and returns the Stat of that node. The
   * node data will be the given data and node acl will be the given acl.
   *
   * The flags argument specifies whether the created node will be ephemeral
   * or not.
   *
   * An ephemeral node will be removed by the ZooKeeper automatically when the
   * session associated with the creation of the node expires.
   *
   * The flags argument can also specify to create a sequential node. The
   * actual path name of a sequential node will be the given path plus a
   * suffix "i" where i is the current sequential number of the node. The sequence
   * number is always fixed length of 10 digits, 0 padded. Once
   * such a node is created, the sequential number will be incremented by one.
   *
   * If a node with the same actual path already exists in the ZooKeeper, a
   * KeeperException with error code KeeperException.NodeExists will be
   * thrown. Note that since a different actual path is used for each
   * invocation of creating sequential node with the same path argument, the
   * call will never throw "file exists" KeeperException.
   *
   * If the parent node does not exist in the ZooKeeper, a KeeperException
   * with error code KeeperException.NoNode will be thrown.
   *
   * An ephemeral node cannot have children. If the parent node of the given
   * path is ephemeral, a KeeperException with error code
   * KeeperException.NoChildrenForEphemerals will be thrown.
   *
   * This operation, if successful, will trigger all the watches left on the
   * node of the given path by exists and getData API calls, and the watches
   * left on the parent node by getChildren API calls.
   *
   * If a node is created successfully, the ZooKeeper server will trigger the
   * watches on the path left by exists calls, and the watches on the parent
   * of the node by getChildren calls.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperExecption to be thrown.
   *
   * @param path the path for the node
   * @param data the initial data for the node
   * @param acl the acl for the node
   * @param flags specifying whether the node to be created is ephemeral and/or sequential
   * @param ttl specifying a TTL when mode is CreateMode.PERSISTENT_WITH_TTL or CreateMode.PERSISTENT_SEQUENTIAL_WITH_TTL
   */
  async create2(path: string, data?: string | Buffer, acl = Ids.OPEN_ACL_UNSAFE, flags = CreateMode.PERSISTENT, ttl?: Buffer) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;

    const packet = flags === CreateMode.PERSISTENT_WITH_TTL || flags === CreateMode.PERSISTENT_SEQUENTIAL_WITH_TTL
      ? this.packetManager.createTTL
      : this.packetManager.create2;

    packet.request.payload.setValue({
      path,
      acl,
      flags,
      data,
      ttl,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Delete the node with the given path. The call will succeed if such a node
   * exists, and the given version matches the node's version (if the given
   * version is -1, it matches any node's versions).
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if the nodes does not exist.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given version does not match the node's version.
   *
   * A KeeperException with error code KeeperException.NotEmpty will be thrown
   * if the node has children.
   *
   * This operation, if successful, will trigger all the watches on the node
   * of the given path left by exists API calls, and the watches on the parent
   * node left by getChildren API calls.
   *
   * @param path the path of the node to be deleted
   * @param version the expected node version
   */
  async delete(path: string, version = -1) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.delete;
    packet.request.payload.setValue({
      path, version,
    });

    await this.connectionManager.send(packet);
    this.packetManager.recyclePacket(packet);
  }

  /**
   * Set the data for the node of the given path if such a node exists and the
   * given version matches the version of the node (if the given version is
   * -1, it matches any node's versions). Return the stat of the node.
   *
   * This operation, if successful, will trigger all the watches on the node
   * of the given path left by getData calls.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given version does not match the node's version.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperException to be thrown.
   *
   * @param path the path of the node
   * @param data the data to set
   * @param version the expected matching version
   */
  async setData(path: string, data: string | Buffer, version = -1) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : Buffer.alloc(0);

    const packet = this.packetManager.setData;
    packet.request.payload.setValue({
      path,
      data,
      version,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   *
   * Return the data and the stat of the node of the given path.
   *
   * If the watch is non-null and the call is successful (no exception is
   * thrown), a watch will be left on the node with the given path. The watch
   * will be triggered by a successful operation that sets data on the node, or
   * deletes the node.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param path the node path
   * @param watcher explicit watcher
   */
  async getData(path: string, watcher?: Watcher) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.getData;
    packet.request.payload.setValue({
      path,
      watch: (typeof watcher === 'function'),
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    if (typeof watcher === 'function') this.watcherManager.registerDataWatcher(path, watcher);

    return res;
  }

  /**
   * Set the ACL for the node of the given path if such a node exists and the
   * given aclVersion matches the acl version of the node. Return the stat of the
   * node.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given aclVersion does not match the node's aclVersion.
   *
   * @param path the given path for the node
   * @param acl the given acl for the node
   * @param version the given acl version of the node
   */
  async setACL(path: string, acl: Array<Jute.data.ACL>, version = -1) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.setACL;
    packet.request.payload.setValue({
      path,
      acl,
      version,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Retrieve the ACL list and the stat of the node of the given path.
   *
   * @param path The node path.
   */
  async getACL(path: string) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.getACL;
    packet.request.payload.setValue({
      path,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Return the stat of the node of the given path. Return null if no such a
   * node exists.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that creates/delete the node or sets
   * the data on the node.
   *
   * @param path the node path
   * @param watcher explicit watcher
   */
  async exists(path: string, watcher?: Watcher) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.exists;
    packet.request.payload.setValue({
      path,
      watch: (typeof watcher === 'function'),
    });

    try {
      await this.connectionManager.send(packet);
      const res = packet.response.payload.valueOf();
      this.packetManager.recyclePacket(packet);

      if (typeof watcher === 'function') this.watcherManager.registerDataWatcher(path, watcher);

      return res;
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;

      if (typeof watcher === 'function') this.watcherManager.registerExistWatcher(path, watcher);

      return null;
    }
  }

  /**
   * Return the list of the children of the node of the given path.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that deletes the node of the given
   * path or creates/delete a child under the node.
   *
   * The list of children returned is not sorted and no guarantee is provided
   * as to its natural or lexical order.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param path the node path
   * @param watcher explicit watcher
   */
  async getChildren(path: string, watcher?: Watcher) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.getChildren;
    packet.request.payload.setValue({
      path,
      watch: (typeof watcher === 'function'),
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    if (typeof watcher === 'function') this.watcherManager.registerChildWatcher(path, watcher);

    return res;
  }

  /**
   * For the given znode path return the stat and children list.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that deletes the node of the given
   * path or creates/delete a child under the node.
   *
   * The list of children returned is not sorted and no guarantee is provided
   * as to its natural or lexical order.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param path the node path
   * @param watcher explicit watcher
   */
  async getChildren2(path: string, watcher?: Watcher) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.getChildren2;
    packet.request.payload.setValue({
      path,
      watch: (typeof watcher === 'function'),
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    if (typeof watcher === 'function') this.watcherManager.registerChildWatcher(path, watcher);

    return res;
  }

  /**
   * Gets all numbers of children nodes under a specific path
   *
   * @param path
   */
  async getAllChildrenNumber(path: string) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.getAllChildrenNumber;
    packet.request.payload.setValue({
      path,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Gets all the ephemeral nodes matching prefixPath
   * created by this session.  If prefixPath is "/" then it returns all
   * ephemerals
   *
   * @param prefixPath
   */
  async getEphemerals(prefixPath = '/') {
    if (typeof prefixPath !== 'string') throw new Exception.Normal('path must be a string');
    prefixPath = utils.normalizePath(prefixPath);

    const packet = this.packetManager.getEphemerals;
    packet.request.payload.setValue({
      prefixPath,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * Flushes channel between process and leader.
   *
   * @param path
   */
  async sync(path: string) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.sync;
    packet.request.payload.setValue({
      path,
    });

    await this.connectionManager.send(packet);
    const res = packet.response.payload.valueOf();
    this.packetManager.recyclePacket(packet);

    return res;
  }

  /**
   * A Transaction is a thin wrapper on the multi method
   * which provides a builder object that can be used to construct
   * and commit an atomic set of operations.
   */
  transaction() {
    return new Transaction(this);
  }

  getChildWatches() {
    return Object.keys(this.watcherManager.childWatchers);
  }

  getDataWatches() {
    return Object.keys(this.watcherManager.dataWatchers);
  }

  getExistWatches() {
    return Object.keys(this.watcherManager.existWatchers);
  }

  /**
   * For the given znode path, removes the specified watcher of given
   * watcherType.
   *
   * Watcher shouldn't be null. A successful call guarantees that, the
   * removed watcher won't be triggered.
   *
   * @param path the path of the node
   * @param watcher explicit watcher
   * @param type the type of watcher to be removed
   */
  async removeWatches(path: string, watcher: Watcher, type: number) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.checkWatches;
    packet.request.payload.setValue({
      path,
      type,
    });

    await this.connectionManager.send(packet);
    this.packetManager.recyclePacket(packet);

    this.watcherManager.removeWatches(path, type, watcher);
  }

  /**
   * For the given znode path, removes all the registered watchers of given
   * watcherType.
   *
   * A successful call guarantees that, the removed watchers won't be
   * triggered.
   *
   * @param path the path of the node
   * @param type the type of watcher to be removed
   */
  async removeAllWatches(path: string, type: number) {
    if (typeof path !== 'string') throw new Exception.Normal('path must be a string');
    path = utils.normalizePath(path);

    const packet = this.packetManager.removeWatches;
    packet.request.payload.setValue({
      path,
      type,
    });

    await this.connectionManager.send(packet);
    this.packetManager.recyclePacket(packet);

    this.watcherManager.removeWatches(path, type);
  }

  /**
   * Return the last committed configuration (as known to the server to which the client is connected)
   * and the stat of the configuration.
   *
   * If the watch is non-null and the call is successful (no exception is
   * thrown), a watch will be left on the configuration node (ZooDefs.CONFIG_NODE). The watch
   * will be triggered by a successful reconfig operation
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if the configuration node doesn't exists.
   *
   * @param watcher explicit watcher
   */
  async getConfig(watcher?: Watcher) {
    return await this.getData(this.options.configNode, watcher);
  }

}
