# node-zookeeper-client

A pure Javascript [ZooKeeper](http://zookeeper.apache.org) client module for
[Node.js](http://nodejs.org).

- [node-zookeeper-client](#node-zookeeper-client)
  - [Requirements](#requirements)
  - [Usage](#usage)
  - [API](#api)
    - [Client](#client)
      - [new Client(connectionString[, options])](#new-clientconnectionstring-options)
      - [client.getSessionId()](#clientgetsessionid)
      - [client.getSessionPassword()](#clientgetsessionpassword)
      - [client.getSessionTimeout()](#clientgetsessiontimeout)
      - [client.connect()](#clientconnect)
      - [client.close()](#clientclose)
      - [client.create(path[, data[, acl[, flags]]])](#clientcreatepath-data-acl-flags)
      - [client.create2(path[, data[, acl[, flags[, ttl]]]])](#clientcreate2path-data-acl-flags-ttl)
      - [client.delete(path[, version])](#clientdeletepath-version)
      - [client.setData(path, data[, version])](#clientsetdatapath-data-version)
      - [client.getData(path[, watcher])](#clientgetdatapath-watcher)
      - [client.setACL(path, acl[, version])](#clientsetaclpath-acl-version)
      - [client.getACL(path)](#clientgetaclpath)
      - [client.exists(path[, watcher])](#clientexistspath-watcher)
      - [client.getChildren(path[, watcher])](#clientgetchildrenpath-watcher)
      - [client.getChildren2(path[, watcher])](#clientgetchildren2path-watcher)
      - [client.getAllChildrenNumber(path)](#clientgetallchildrennumberpath)
      - [client.getEphemerals(prefixPath)](#clientgetephemeralsprefixpath)
      - [client.sync(path)](#clientsyncpath)
      - [client.transaction()](#clienttransaction)
      - [client.getChildWatches()](#clientgetchildwatches)
      - [client.getDataWatches()](#clientgetdatawatches)
      - [client.getExistWatches()](#clientgetexistwatches)
      - [client.removeWatches(path, watcher, type)](#clientremovewatchespath-watcher-type)
      - [client.removeAllWatches(path, type)](#clientremoveallwatchespath-type)
      - [client.getConfig([watcher])](#clientgetconfigwatcher)
    - [Transaction](#transaction)
      - [t.create(path[, data[, acl[, flags]]])](#tcreatepath-data-acl-flags)
      - [t.check(path[, version])](#tcheckpath-version)
      - [t.setData(path, data[, version])](#tsetdatapath-data-version)
      - [t.remove(path, data[, version])](#tremovepath-data-version)
      - [t.commit()](#tcommit)
    - [ZK.createClient(connectionString[, options])](#zkcreateclientconnectionstring-options)
    - [CreateMode](#createmode)
    - [OpCode](#opcode)
    - [Perms](#perms)
    - [Xid](#xid)
    - [WatcherType](#watchertype)
    - [EventType](#eventtype)
    - [EventState](#eventstate)
    - [ExceptionCode](#exceptioncode)
    - [ConnectionEvent](#connectionevent)
    - [Ids](#ids)
  - [Jute](#jute)
  - [License](#license)

## Requirements

* lodash

## Usage

```shell
npm i @souche/node-zookeeper-client
```

```js
const ZK = require('@souche/node-zookeeper-client');
const client = ZK.createClient('127.0.0.1:2181');

(async () => {
  console.log('start');
  await client.connect();

  if (!await client.exists('/test')) {
    await client.create('/test');
  }

  await client.setData('/test', 'some data');

  await client.create('/test/1');
  console.log(await client.getChildren('/test'));
  await client.delete('/test/1');

  await client.close();
  console.log('finish');
})().catch(err => {
  console.log(err);
});
```

```js
const ZK = require('@souche/node-zookeeper-client');
const client = ZK.createClient('127.0.0.1:2181');

(async () => {
  console.log('start');
  await client.connect();

  await client
    .transaction()
    .create('/test')
    .setData('/test', 'some data')
    .create('/test/1')
    .create('/test/2')
    .remove('/test/1')
    .commit();

  await client.close();
  console.log('finish');
})().catch(err => {
  console.log(err);
});
```

## API

### Client

#### new Client(connectionString[, options])

* connectionString ``string``
* options ``object``
  * authInfo ``Array<{ scheme: string, auth: string|Buffer }>`` scheme:auth information
  * configNode ``string`` default: /zookeeper/config
  * connectTimeout ``number`` socket connect timeout, default: 5000
  * reconnectInterval ``number`` Time to wait after try all server failed, default: 1000
  * retries ``number`` Times to retry send packet to server, default: 3
  * retryInterval ``number`` Time to wait before retry send, default: 0
  * showFriendlyErrorStack ``boolean`` Show friendly error stack, default: ``development ? true : false``
  * logger ``{error: Function, info: Function, warn: Function, debug: Function}``
  * PacketManager ``PacketManager``
  * WatcherManager ``WatcherManager``

#### client.getSessionId()

* Returns: sessionId ``buffer``

The session id for this ZooKeeper client instance. The value returned is not valid until the client connects to a server and may change after a re-connect.

#### client.getSessionPassword()

* Returns: sessionPassword ``buffer``

The session password for this ZooKeeper client instance. The value returned is not valid until the client connects to a server and may change after a re-connect.

#### client.getSessionTimeout()

* Returns: sessionTimeout ``number``

The negotiated session timeout for this ZooKeeper client instance. The value returned is not valid until the client connects to a server and may change after a re-connect.

#### client.connect()

* Returns: ``Promise<void>``

Start the client and try to connect to the ensemble.

#### client.close()

* Returns: ``Promise<void>``

Close this client object. Once the client is closed, its session becomes invalid. All the ephemeral nodes in the ZooKeeper server associated with the session will be removed. The watches left on those nodes (and on their parents) will be triggered.

#### client.create(path[, data[, acl[, flags]]])

* path ``string`` the path for the node
* data ``string|Buffer`` the initial data for the node
* acl ``Array<Jute.data.ACL>`` the acl for the node, default: ``Ids.OPEN_ACL_UNSAFE``
* flags ``number`` specifying whether the node to be created is ephemeral and/or sequential, default: ``CreateMode.PERSISTENT``
* Returns: ``Promise<Jute.proto.CreateResponse>``

Create a node with the given path. The node data will be the given data, and node acl will be the given acl.

#### client.create2(path[, data[, acl[, flags[, ttl]]]])

* path ``string`` the path for the node
* data ``string|Buffer`` the initial data for the node
* acl ``Array<Jute.data.ACL>`` the acl for the node, default: ``Ids.OPEN_ACL_UNSAFE``
* flags ``number`` specifying whether the node to be created is ephemeral and/or sequential, default: ``CreateMode.PERSISTENT``
* ttl ``Buffer`` specifying a TTL when mode is CreateMode.PERSISTENT_WITH_TTL or CreateMode.PERSISTENT_SEQUENTIAL_WITH_TTL
* Returns: ``Promise<Jute.proto.Create2Response>``

Create a node with the given path and returns the Stat of that node. The node data will be the given data and node acl will be the given acl.

#### client.delete(path[, version])

* path ``string`` the path for the node
* version ``number`` the expected node version, default: -1
* Returns: ``Promise<void>``

Delete the node with the given path. The call will succeed if such a node exists, and the given version matches the node's version (if the given version is -1, it matches any node's versions).

#### client.setData(path, data[, version])

* path ``string`` the path for the node
* data ``string|Buffer`` the data to set
* version ``number`` the expected node version, default: -1
* Returns: ``Promise<Jute.proto.SetDataResponse>``

Set the data for the node of the given path if such a node exists and the given version matches the version of the node (if the given version is -1, it matches any node's versions). Return the stat of the node.

#### client.getData(path[, watcher])

* path ``string`` the node path
* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* Returns: ``Promise<Jute.proto.GetDataResponse>``

Return the data and the stat of the node of the given path.

#### client.setACL(path, acl[, version])

* path ``string`` the given path for the node
* acl ``Array<Jute.data.ACL>`` the given acl for the node
* version ``number`` the given acl version of the node, default: -1
* Returns: ``Promise<Jute.proto.SetACLResponse>``

Set the ACL for the node of the given path if such a node exists and the given aclVersion matches the acl version of the node. Return the stat of the node.

#### client.getACL(path)

* path ``string`` the given path for the node
* Returns: ``Promise<Jute.proto.GetACLResponse>``

Retrieve the ACL list and the stat of the node of the given path.

#### client.exists(path[, watcher])

* path ``string`` the node path
* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* Returns: ``Promise<Jute.proto.ExistsResponse>``

Return the stat of the node of the given path. Return null if no such a node exists.

#### client.getChildren(path[, watcher])

* path ``string`` the node path
* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* Returns: ``Promise<Jute.proto.GetChildrenResponse>``

Return the list of the children of the node of the given path.

#### client.getChildren2(path[, watcher])

* path ``string`` the node path
* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* Returns: ``Promise<Jute.proto.GetChildren2Response>``

For the given znode path return the stat and children list.

#### client.getAllChildrenNumber(path)

* path ``string`` the node path
* Returns: ``Promise<Jute.proto.GetAllChildrenNumberResponse>``

Gets all numbers of children nodes under a specific path

#### client.getEphemerals(prefixPath)

* path ``prefixPath``
* Returns: ``Promise<Jute.proto.GetEphemeralsResponse>``

Gets all the ephemeral nodes matching prefixPath created by this session.  If prefixPath is "/" then it returns all ephemerals

#### client.sync(path)

* path ``path``
* Returns: ``Promise<Jute.proto.SyncResponse>``

Flushes channel between process and leader.

#### client.transaction()

* Returns: ``Transaction``

A Transaction is a thin wrapper on the multi method which provides a builder object that can be used to construct and commit an atomic set of operations.

#### client.getChildWatches()

* Returns: ``Array<string>``

#### client.getDataWatches()

* Returns: ``Array<string>``

#### client.getExistWatches()

* Returns: ``Array<string>``

#### client.removeWatches(path, watcher, type)

* path ``path``
* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* type ``number`` the type of watcher to be removed
* Returns: ``Promise<void>``

For the given znode path, removes the specified watcher of given watcherType.

#### client.removeAllWatches(path, type)

* path ``path``
* type ``number`` the type of watcher to be removed
* Returns: ``Promise<void>``

For the given znode path, removes all the registered watchers of given watcherType.

#### client.getConfig([watcher])

* watcher ``(event: Jute.proto.WatcherEvent) => any`` explicit watcher
* Returns: ``Promise<Jute.proto.GetDataResponse>``

Return the last committed configuration (as known to the server to which the client is connected) and the stat of the configuration.

### Transaction

#### t.create(path[, data[, acl[, flags]]])

* path ``string`` the path for the node
* data ``string|Buffer`` the initial data for the node
* acl ``Array<Jute.data.ACL>`` the acl for the node, default: ``Ids.OPEN_ACL_UNSAFE``
* flags ``number`` specifying whether the node to be created is ephemeral and/or sequential, default: ``CreateMode.PERSISTENT``
* Returns: ``this``

Add a create operation with given path, data, acls and mode.

#### t.check(path[, version])

* path ``string`` the path for the node
* version ``number`` the expected node version, default: -1
* Returns: ``this``

Add a check (existence) operation with given path and optional version.

#### t.setData(path, data[, version])

* path ``string`` the path for the node
* data ``string|Buffer`` the data to set
* version ``number`` the expected node version, default: -1
* Returns: ``this``

Add a set-data operation with the given path, data and optional version.

#### t.remove(path, data[, version])

* path ``string`` the path for the node
* version ``number`` the expected node version, default: -1
* Returns: ``this``

Add a delete operation with the given path and optional version.

#### t.commit()

* Returns: ``Promise<Array<{ header: Jute.proto.MultiHeader, payload: object }>>``

Execute the transaction atomically.

### ZK.createClient(connectionString[, options])

[See](#new%20Client(connectionString%5B%2C%20options%5D))

### CreateMode

### OpCode

### Perms

### Xid

### WatcherType

### EventType

### EventState

### ExceptionCode

### ConnectionEvent

### Ids

## Jute

Jute is a serialization tool of Zookeeper.

Type mapping:

* ustring: ``string``
* int: ``number``
* long: ``Buffer``
* buffer: ``Buffer``
* vector: ``Array``
* boolean: ``boolean``

See: https://github.com/apache/zookeeper/blob/master/zookeeper-jute/src/main/resources/zookeeper.jute

## License

This module is licensed under [MIT License](raw/master/LICENSE)
