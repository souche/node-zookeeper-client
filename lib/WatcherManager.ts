/**
 * xiedacon created at 2019-05-27 16:59:55
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import * as events from 'events';

import Exception from './Exception';
import {
  Xid,
  EventType,
  EventState,
  ConnectionEvent,
  WatcherType,
} from './constants';
import jute from './jute';
import * as utils from './utils';

import Client, { Watcher } from './Client';
import PacketManager from './PacketManager';
import ConnectionManager from './ConnectionManager';

export default class WatcherManager extends events.EventEmitter {
  public dataWatchers: { [key: string]: events.EventEmitter } = {};
  public childWatchers: { [key: string]: events.EventEmitter } = {};
  public existWatchers: { [key: string]: events.EventEmitter } = {};

  private client: Client;
  private packetManager: PacketManager;
  private connectionManager: ConnectionManager;

  constructor(client: Client) {
    super();

    this.client = client;
  }

  async ready() {
    this.packetManager = this.client.packetManager;
    this.connectionManager = this.client.connectionManager;

    this.client.connectionManager.on(ConnectionEvent.connect, () => {
      const packet = this.packetManager.setWatches;
      packet.request.header.xid = Xid.setWatches;
      packet.request.payload.setValue({
        relativeZxid: this.connectionManager.zxid,
        dataWatches: this.getDataWatcherPaths(),
        existWatches: this.getExistWatcherPaths(),
        childWatches: this.getChildWatcherPaths(),
      });
      packet.request.setChrootPath(this.connectionManager.chrootPath);

      // Send inner-request without queue
      if (this.connectionManager.socket) this.connectionManager.socket.write(packet.request.toBuffer());

      this.packetManager.recyclePacket(packet);
    });
  }

  registerWatcher(watchers: { [key: string]: events.EventEmitter }, path: string, watcher: Watcher) {
    if (typeof watcher !== 'function') throw new Error('watcher must be a valid function.');
    path = utils.normalizePath(path);

    let watcherExists = false;
    watchers[path] = watchers[path] || new events.EventEmitter();
    watcherExists = watchers[path].listeners('notification').some(l => {
      // This is rather hacky since node.js wraps the listeners using an
      // internal function.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return l === watcher || l.listener === watcher;
    });

    if (!watcherExists) {
      watchers[path].once('notification', watcher);
    }
  }

  registerDataWatcher(path: string, watcher: Watcher) {
    this.registerWatcher(this.dataWatchers, path, watcher);
  }

  registerChildWatcher(path: string, watcher: Watcher) {
    this.registerWatcher(this.childWatchers, path, watcher);
  }

  registerExistWatcher(path: string, watcher: Watcher) {
    this.registerWatcher(this.existWatchers, path, watcher);
  }

  getWatcherPaths(watchers: { [key: string]: events.EventEmitter }) {
    const result = [] as Array<string>;

    for (const path of Object.keys(watchers)) {
      if (watchers[path].listeners('notification').length > 0) {
        result.push(path);
      }
    }

    return result;
  }

  getDataWatcherPaths() {
    return this.getWatcherPaths(this.dataWatchers);
  }

  getChildWatcherPaths() {
    return this.getWatcherPaths(this.childWatchers);
  }

  getExistWatcherPaths() {
    return this.getWatcherPaths(this.existWatchers);
  }

  emit(eventType: string, watcherEvent: Jute.proto.WatcherEvent) {
    const emitters = [] as Array<events.EventEmitter>;
    const event = watcherEvent.valueOf();

    switch (event.type) {
      case EventType.None:
        // eslint-disable-next-line no-case-declarations
        const watcherList = [ this.dataWatchers, this.childWatchers, this.existWatchers ];

        for (const watchers of watcherList) {
          for (const path of Object.keys(watchers)) {
            if (watchers[path]) {
              emitters.push(watchers[path]);
            }
          }
        }
        break;
      case EventType.NodeDataChanged:
      case EventType.NodeCreated:
        if (this.dataWatchers[event.path]) {
          emitters.push(this.dataWatchers[event.path]);
          delete this.dataWatchers[event.path];
        }

        if (this.existWatchers[event.path]) {
          emitters.push(this.existWatchers[event.path]);
          delete this.existWatchers[event.path];
        }
        break;
      case EventType.NodeChildrenChanged:
        if (this.childWatchers[event.path]) {
          emitters.push(this.childWatchers[event.path]);
          delete this.childWatchers[event.path];
        }
        break;
      case EventType.NodeDeleted:
        if (this.dataWatchers[event.path]) {
          emitters.push(this.dataWatchers[event.path]);
          delete this.dataWatchers[event.path];
        }
        if (this.childWatchers[event.path]) {
          emitters.push(this.childWatchers[event.path]);
          delete this.childWatchers[event.path];
        }
        break;
      default:
        throw new Exception.Normal(`Unknown event type: ${event.type}`);
    }

    process.nextTick(() => {
      for (const emitter of emitters) {
        emitter.emit('notification', event);
      }
    });

    return true;
  }

  async close() {
    // Emit close event for all watches
    this.emit('', new jute.proto.WatcherEvent({
      state: EventState.Closed,
      type: EventType.None,
    }));
  }

  clear() {
    const watcherList = [ this.dataWatchers, this.childWatchers, this.existWatchers ];

    for (const watchers of watcherList) {
      for (const path of Object.keys(watchers)) {
        if (watchers[path]) {
          watchers[path].removeAllListeners();
        }
      }
    }

    this.removeAllListeners();
    this.dataWatchers = {};
    this.childWatchers = {};
    this.existWatchers = {};
  }

  removeWatches(path: string, type: number, watcher?: Watcher) {
    switch (type) {
      case WatcherType.Children:
        if (this.childWatchers[path]) {
          watcher
            ? this.childWatchers[path].removeListener('notification', watcher)
            : this.childWatchers[path].removeAllListeners();

          delete this.childWatchers[path];
        }
        break;
      case WatcherType.Data:
        if (this.dataWatchers[path]) {
          watcher
            ? this.dataWatchers[path].removeListener('notification', watcher)
            : this.dataWatchers[path].removeAllListeners();

          delete this.dataWatchers[path];
        }
        if (this.existWatchers[path]) {
          watcher
            ? this.existWatchers[path].removeListener('notification', watcher)
            : this.existWatchers[path].removeAllListeners();

          delete this.existWatchers[path];
        }
        break;
      case WatcherType.Any:
        if (this.childWatchers[path]) {
          watcher
            ? this.childWatchers[path].removeListener('notification', watcher)
            : this.childWatchers[path].removeAllListeners();

          delete this.childWatchers[path];
        }
        if (this.dataWatchers[path]) {
          watcher
            ? this.dataWatchers[path].removeListener('notification', watcher)
            : this.dataWatchers[path].removeAllListeners();

          delete this.dataWatchers[path];
        }
        if (this.existWatchers[path]) {
          watcher
            ? this.existWatchers[path].removeListener('notification', watcher)
            : this.existWatchers[path].removeAllListeners();

          delete this.existWatchers[path];
        }
        break;
      default:
        throw new Exception.Normal(`Unknown watcher type: ${type}`);
    }
  }

}
