/**
 * xiedacon created at 2020-01-15 09:39:52
 *
 * Copyright (c) 2020 Souche.com, all rights reserved.
 */

import test from 'ava';

import { createClient } from '../index';

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

  await client.transaction()
    .create('/sdktest')
    .check('/sdktest')
    .setData('/sdktest', 'test')
    .create('/sdktest/1')
    .commit();

  t.deepEqual(
    (await client.getData('/sdktest')).data.toString('utf-8'),
    'test'
  );

  t.deepEqual(
    await client.getChildren('/sdktest'),
    { children: [ '1' ] }
  );

  await client.transaction()
    .remove('/sdktest/1')
    .remove('/sdktest')
    .commit();

  t.falsy(await client.exists('/sdktest'));

  await client.close();

  t.pass();
});
