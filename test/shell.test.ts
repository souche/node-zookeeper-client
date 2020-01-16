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

  const shell = client.shell;

  await shell.mkdirp('/sdktest/1/2/3/4/5');
  await shell.touch('/sdktest/1/2/3/4/5/6');
  await shell.touch('/sdktest/1/2/3/4/5/6');
  await shell.touch('/sdktest/1/2/3/4/5/7');
  t.deepEqual(
    await shell.ls('/sdktest/1/2/3/4/5'),
    [ '6', '7' ]
  );

  await client.create('/sdktest/1/2/3/4/5/8', 'test');

  t.deepEqual(
    await shell.cat('/sdktest/1/2/3/4/5/8'),
    'test'
  );

  await shell.cp('/sdktest/1/2/3/4/5/8', '/sdktest/1/2/3/4/5/9');
  t.deepEqual(
    await shell.cat('/sdktest/1/2/3/4/5/9'),
    'test'
  );

  await shell.cpr('/sdktest/1', '/sdktest/2');
  t.deepEqual(
    (await shell.ls('/sdktest/2/2/3/4/5')).sort(),
    [ '6', '7', '8', '9' ]
  );

  await shell.mv('/sdktest/2', '/sdktest/3');

  t.falsy(await client.exists('/sdktest/2'));
  t.deepEqual(
    (await shell.ls('/sdktest/3/2/3/4/5')).sort(),
    [ '6', '7', '8', '9' ]
  );

  t.deepEqual(
    (await shell.tree('/sdktest/3')).sort(),
    [
      '2',
      '2/3',
      '2/3/4',
      '2/3/4/5',
      '2/3/4/5/6',
      '2/3/4/5/7',
      '2/3/4/5/8',
      '2/3/4/5/9',
    ]
  );

  await shell.rm('/sdktest/3/2/3/4/5/9');
  t.falsy(await client.exists('/sdktest/3/2/3/4/5/9'));

  await shell.rmrf('/sdktest');
  t.falsy(await client.exists('/sdktest'));

  await client.close();

  t.pass();
});
