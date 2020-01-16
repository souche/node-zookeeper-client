/**
 * xiedacon created at 2020-01-15 09:39:52
 *
 * Copyright (c) 2020 Souche.com, all rights reserved.
 */

import * as util from 'util';

import test from 'ava';

import { createClient, CreateMode, Ids, EventState, EventType, WatcherType } from '../index';

const sleep = util.promisify(setTimeout);

const connectionString = '127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183';

test.beforeEach(async () => {
  const client = createClient(connectionString);
  await client.connect();

  await client.shell.rmrf('/sdktest');

  await client.close();
});

test.serial('it should work', async t => {
  const client = createClient(connectionString);
  await client.connect();

  t.deepEqual(
    await client.create('/sdktest', 'test'),
    { path: '/sdktest' }
  );

  t.truthy(await client.exists('/sdktest'));

  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with EPHEMERAL node', async t => {
  const client = createClient(connectionString);
  await client.connect();

  t.deepEqual(
    await client.create('/sdktest', 'test', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL),
    { path: '/sdktest' }
  );

  t.truthy(await client.exists('/sdktest'));

  await client.close();

  await sleep(3000);

  await client.connect();

  t.falsy(await client.exists('/sdktest'));

  t.pass();
});

test.serial('it should work with create2', async t => {
  const client = createClient(connectionString);
  await client.connect();

  t.deepEqual(
    (await client.create2('/sdktest', 'test')).path,
    '/sdktest'
  );

  t.truthy(await client.exists('/sdktest'));

  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with create2 and EPHEMERAL node', async t => {
  const client = createClient(connectionString);
  await client.connect();

  t.deepEqual(
    (await client.create2('/sdktest', 'test', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL)).path,
    '/sdktest'
  );

  t.truthy(await client.exists('/sdktest'));

  await client.close();

  await sleep(3000);

  await client.connect();

  t.falsy(await client.exists('/sdktest'));

  t.pass();
});

test.serial('it should work with data', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');

  t.deepEqual(
    (await client.getData('/sdktest')).data.toString('utf-8'),
    'test'
  );

  await client.setData('/sdktest', 'test1');
  t.deepEqual(
    (await client.getData('/sdktest')).data.toString('utf-8'),
    'test1'
  );

  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with data watcher', async t => {
  t.plan(3);

  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');

  await client.getData('/sdktest', event => {
    t.deepEqual(event.path, '/sdktest');
    t.deepEqual(event.state, EventState.SyncConnected);
    t.deepEqual(event.type, EventType.NodeDataChanged);
  });

  await client.setData('/sdktest', 'test1');

  await client.delete('/sdktest');
  await client.close();
});

test.serial('it should work with children', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  t.deepEqual(
    await client.getChildren('/sdktest'),
    { children: [ '1' ] }
  );

  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with children watcher', async t => {
  t.plan(3);

  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  await client.getChildren('/sdktest', event => {
    t.deepEqual(event.path, '/sdktest');
    t.deepEqual(event.state, EventState.SyncConnected);
    t.deepEqual(event.type, EventType.NodeChildrenChanged);
  });

  await client.create('/sdktest/2');

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();
});

test.serial('it should work with children2', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  t.deepEqual(
    (await client.getChildren2('/sdktest')).children,
    [ '1' ]
  );

  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with children2 watcher', async t => {
  t.plan(3);

  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  await client.getChildren2('/sdktest', event => {
    t.deepEqual(event.path, '/sdktest');
    t.deepEqual(event.state, EventState.SyncConnected);
    t.deepEqual(event.type, EventType.NodeChildrenChanged);
  });

  await client.create('/sdktest/2');

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();
});

test.skip('it should work with getAllChildrenNumber', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  t.deepEqual(
    await client.getAllChildrenNumber('/sdktest'),
    { totalNumber: 0 }
  );

  await client.create('/sdktest/1');

  t.deepEqual(
    await client.getAllChildrenNumber('/sdktest'),
    { totalNumber: 1 }
  );

  await client.create('/sdktest/2');

  t.deepEqual(
    await client.getAllChildrenNumber('/sdktest'),
    { totalNumber: 2 }
  );

  await sleep(3000);

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.skip('it should work with getEphemerals', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1', 'test', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
  await client.create('/sdktest/2', 'test', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);

  t.deepEqual(
    await client.getEphemerals('/sdktest'),
    { ephemerals: [ '/sdktest/1', '/sdktest/2' ] }
  );

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with watchers', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  await client.getChildren('/sdktest', event => event);

  t.deepEqual(
    client.getChildWatches(),
    [
      '/sdktest',
    ]
  );

  await client.getData('/sdktest/1', event => event);

  t.deepEqual(
    client.getDataWatches(),
    [
      '/sdktest/1',
    ]
  );

  await client.exists('/sdktest/2', event => event);

  t.deepEqual(
    client.getExistWatches(),
    [
      '/sdktest/2',
    ]
  );

  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();

  t.pass();
});

test.serial('it should work with removeWatches', async t => {
  t.plan(0);

  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  const watcher = event => {
    t.deepEqual(event.path, '/sdktest');
    t.deepEqual(event.state, EventState.SyncConnected);
    t.deepEqual(event.type, EventType.NodeChildrenChanged);
  };
  await client.getChildren('/sdktest', watcher);

  await client.removeWatches('/sdktest', watcher, WatcherType.Children);
  await client.create('/sdktest/2');

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();
});

test.serial('it should work with removeAllWatches', async t => {
  t.plan(0);

  const client = createClient(connectionString);
  await client.connect();

  await client.create('/sdktest', 'test');
  await client.create('/sdktest/1');

  await client.getChildren('/sdktest', event => {
    t.deepEqual(event.path, '/sdktest');
    t.deepEqual(event.state, EventState.SyncConnected);
    t.deepEqual(event.type, EventType.NodeChildrenChanged);
  });

  await client.removeAllWatches('/sdktest', WatcherType.Children);
  await client.create('/sdktest/2');

  await client.delete('/sdktest/2');
  await client.delete('/sdktest/1');
  await client.delete('/sdktest');
  await client.close();
});
