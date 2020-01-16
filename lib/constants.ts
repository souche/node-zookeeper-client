/**
 * xiedacon created at 2019-06-03 17:43:42
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import jute from './jute';

export const CreateMode = {
  PERSISTENT: 0,
  PERSISTENT_SEQUENTIAL: 2,
  EPHEMERAL: 1,
  EPHEMERAL_SEQUENTIAL: 3,
  CONTAINER: 4,
  PERSISTENT_WITH_TTL: 5,
  PERSISTENT_SEQUENTIAL_WITH_TTL: 6,
};

export const OpCode = {
  notification: 0,
  create: 1,
  delete: 2,
  exists: 3,
  getData: 4,
  setData: 5,
  getACL: 6,
  setACL: 7,
  getChildren: 8,
  sync: 9,
  ping: 11,
  getChildren2: 12,
  check: 13,
  multi: 14,
  create2: 15,
  reconfig: 16,
  checkWatches: 17,
  removeWatches: 18,
  createContainer: 19,
  deleteContainer: 20,
  createTTL: 21,
  auth: 100,
  setWatces: 101,
  sasl: 102,
  getEphemerals: 103,
  getAllChildrenNumber: 104,
  createSession: -10,
  closeSession: -11,
  error: -1,
};

export const Perms = {
  READ: 1,
  WRITE: 2,
  CREATE: 4,
  DELETE: 8,
  ADMIN: 16,
  ALL: 31,
};

export const Xid = {
  notification: -1,
  ping: -2,
  authentication: -4,
  setWatches: -8,
};

export const WatcherType = {
  Children: 1,
  Data: 2,
  Any: 3,
};

export const EventType = {
  None: -1,
  NodeCreated: 1,
  NodeDeleted: 2,
  NodeDataChanged: 3,
  NodeChildrenChanged: 4,
  DataWatchRemoved: 5,
  ChildWatchRemoved: 6,
};

export const EventState = {
  Unknown: -1,
  Disconnected: 0,
  NoSyncConnected: 1,
  SyncConnected: 3,
  AuthFailed: 4,
  ConnectedReadOnly: 5,
  SaslAuthenticated: 6,
  Expired: -122,
  Closed: 7,
};

export const ExceptionCode = {
  OK: 0,
  SYSTEM_ERROR: -1,
  RUNTIME_INCONSISTENCY: -2,
  DATA_INCONSISTENCY: -3,
  CONNECTION_LOSS: -4,
  MARSHALLING_ERROR: -5,
  UNIMPLEMENTED: -6,
  OPERATION_TIMEOUT: -7,
  BAD_ARGUMENTS: -8,
  UNKNOWN_SESSION: -12,
  NEW_CONFIG_NO_QUORUM: -13,
  RECONFIG_IN_PROGRESS: -14,
  API_ERROR: -100,
  NO_NODE: -101,
  NO_AUTH: -102,
  BAD_VERSION: -103,
  NO_CHILDREN_FOR_EPHEMERALS: -108,
  NODE_EXISTS: -110,
  NOT_EMPTY: -111,
  SESSION_EXPIRED: -112,
  INVALID_CALLBACK: -113,
  INVALID_ACL: -114,
  AUTH_FAILED: -115,
  SESSION_MOVED: -118,
  NOT_READONLY: -119,
  EPHEMERAL_ON_LOCAL_SESSION: -120,
  NOWATCHER: -121,
  REQUEST_TIMEOUT: -122,
  RECONFIG_DISABLED: -123,
};

export const ConnectionEvent = {
  // state events
  connecting: 'connecting',
  reconnecting: 'reconnecting',
  connect: 'connect',
  disconnect: 'disconnect',
  closing: 'closing',
  closed: 'closed',
  error: 'error',

  serverAvailable: 'serverAvailable',
  serverUnavailable: 'serverUnavailable',
};

const ANYONE_ID_UNSAFE = new jute.data.Id({ id: 'anyone', scheme: 'world' });
const AUTH_IDS = new jute.data.Id({ id: '', scheme: 'auth' });

export const Ids = {
  ANYONE_ID_UNSAFE,
  AUTH_IDS,
  OPEN_ACL_UNSAFE: [ new jute.data.ACL({ id: ANYONE_ID_UNSAFE, perms: exports.Perms.ALL }) ],
  CREATOR_ALL_ACL: [ new jute.data.ACL({ id: AUTH_IDS, perms: exports.Perms.ALL }) ],
  READ_ACL_UNSAFE: [ new jute.data.ACL({ id: ANYONE_ID_UNSAFE, perms: exports.Perms.READ }) ],
};
