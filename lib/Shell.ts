/**
 * xiedacon created at 2019-11-02 13:43:34
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import {
  CreateMode,
  Ids,
  ExceptionCode,
} from './constants';
import Client from './Client';

export default class Shell {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  /**
   * touch
   *
   * @param path the path for the node
   */
  async touch(path: string) {
    try {
      return await this.client.create(path, '', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
    } catch (err) {
      if (err.code !== ExceptionCode.NODE_EXISTS) throw err;
    }
  }

  /**
   * mkdir -p
   *
  * @param path the path for the node
   */
  async mkdirp(path: string) {
    let parent = '';
    const parts = path.split(/\//g);

    for (const part of parts) {
      parent = `${parent}/${part}`;
      try {
        await this.client.create(parent);
      } catch (err) {
        if (err.code !== ExceptionCode.NODE_EXISTS) throw err;
      }
    }
  }

  /**
   * cp
   *
   * @param from the path for the node
   * @param to the path for the node
   */
  async cp(from: string, to: string) {
    const { data, stat } = await this.client.getData(from);
    const { acl } = await this.client.getACL(from);

    await this.client.create(
      to,
      data,
      acl,
      stat.ephemeralOwner.toString() === Buffer.alloc(8).toString()
        ? CreateMode.PERSISTENT
        : CreateMode.EPHEMERAL
    );
  }

  /**
   * cp -r
   *
   * @param from the path for the node
   * @param to the path for the node
   */
  async cpr(from: string, to: string) {
    await this.cp(from, to);

    for (const child of await this.ls(from)) {
      await this.cpr(`${from}/${child}`, `${to}/${child}`);
    }
  }

  /**
   * mv
   *
   * @param from
   * @param to
   */
  async mv(from: string, to: string) {
    await this.cpr(from, to);
    await this.rmrf(from);
  }

  /**
   * ls
   *
   * @param path the path for the node
   */
  async ls(path: string) {
    try {
      const { children } = await this.client.getChildren(path);
      return children;
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;

      return [];
    }
  }

  /**
   * tree
   *
   * @param path the path for the node
   */
  async tree(path: string) {
    const tree = [] as Array<string>;
    for (const child of await this.ls(path)) {
      tree.push(
        child,
        ...(await this.tree(`${path}/${child}`)).map(p => `${child}/${p}`)
      );
    }

    return tree;
  }

  /**
   * cat
   *
   * @param path the path for the node
   */
  async cat(path: string) {
    try {
      const { data } = await this.client.getData(path);
      return data.toString();
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;

      return '';
    }
  }

  /**
   * rm
   *
   * @param path the path for the node
   */
  async rm(path: string) {
    try {
      await this.client.delete(path);
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;
    }
  }

  /**
   * rm -rf
   *
   * @param path the path for the node
   */
  async rmrf(path: string) {
    for (const child of await this.ls(path)) {
      await this.rmrf(`${path}/${child}`);
    }

    await this.rm(path);
  }

}
