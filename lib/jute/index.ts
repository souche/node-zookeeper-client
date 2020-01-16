/**
* This file created by ./bin/gen_types
* Do not modify this file!!!!!!!!!
 */

import boolean from './boolean';
import buffer from './buffer';
import int from './int';
import long from './long';
import ustring from './ustring';
import vector from './vector';

import type from './basic/type';
import object from './basic/object';
import RequestRecord from './basic/RequestRecord';
import ResponseRecord from './basic/ResponseRecord';
import EmptyRequestRecord from './basic/EmptyRequestRecord';
import EmptyResponseRecord from './basic/EmptyResponseRecord';
import EmptyRequestHeader from './basic/EmptyRequestHeader';

const basic = {
  type,
  object,
  RequestRecord,
  ResponseRecord,
  EmptyRequestRecord,
  EmptyResponseRecord,
  EmptyRequestHeader,
};

import Id from './data/Id';
import ACL from './data/ACL';
import Stat from './data/Stat';
import StatPersisted from './data/StatPersisted';

const data = {
  Id,
  ACL,
  Stat,
  StatPersisted,
};

import ConnectRequest from './proto/ConnectRequest';
import ConnectResponse from './proto/ConnectResponse';
import SetWatches from './proto/SetWatches';
import RequestHeader from './proto/RequestHeader';
import MultiHeader from './proto/MultiHeader';
import AuthPacket from './proto/AuthPacket';
import ReplyHeader from './proto/ReplyHeader';
import GetDataRequest from './proto/GetDataRequest';
import SetDataRequest from './proto/SetDataRequest';
import ReconfigRequest from './proto/ReconfigRequest';
import SetDataResponse from './proto/SetDataResponse';
import GetSASLRequest from './proto/GetSASLRequest';
import SetSASLRequest from './proto/SetSASLRequest';
import SetSASLResponse from './proto/SetSASLResponse';
import CreateRequest from './proto/CreateRequest';
import CreateTTLRequest from './proto/CreateTTLRequest';
import DeleteRequest from './proto/DeleteRequest';
import GetChildrenRequest from './proto/GetChildrenRequest';
import GetAllChildrenNumberRequest from './proto/GetAllChildrenNumberRequest';
import GetChildren2Request from './proto/GetChildren2Request';
import CheckVersionRequest from './proto/CheckVersionRequest';
import GetMaxChildrenRequest from './proto/GetMaxChildrenRequest';
import GetMaxChildrenResponse from './proto/GetMaxChildrenResponse';
import SetMaxChildrenRequest from './proto/SetMaxChildrenRequest';
import SyncRequest from './proto/SyncRequest';
import SyncResponse from './proto/SyncResponse';
import GetACLRequest from './proto/GetACLRequest';
import SetACLRequest from './proto/SetACLRequest';
import SetACLResponse from './proto/SetACLResponse';
import WatcherEvent from './proto/WatcherEvent';
import ErrorResponse from './proto/ErrorResponse';
import CreateResponse from './proto/CreateResponse';
import Create2Response from './proto/Create2Response';
import ExistsRequest from './proto/ExistsRequest';
import ExistsResponse from './proto/ExistsResponse';
import GetDataResponse from './proto/GetDataResponse';
import GetChildrenResponse from './proto/GetChildrenResponse';
import GetAllChildrenNumberResponse from './proto/GetAllChildrenNumberResponse';
import GetChildren2Response from './proto/GetChildren2Response';
import GetACLResponse from './proto/GetACLResponse';
import CheckWatchesRequest from './proto/CheckWatchesRequest';
import RemoveWatchesRequest from './proto/RemoveWatchesRequest';
import GetEphemeralsRequest from './proto/GetEphemeralsRequest';
import GetEphemeralsResponse from './proto/GetEphemeralsResponse';

const proto = {
  ConnectRequest,
  ConnectResponse,
  SetWatches,
  RequestHeader,
  MultiHeader,
  AuthPacket,
  ReplyHeader,
  GetDataRequest,
  SetDataRequest,
  ReconfigRequest,
  SetDataResponse,
  GetSASLRequest,
  SetSASLRequest,
  SetSASLResponse,
  CreateRequest,
  CreateTTLRequest,
  DeleteRequest,
  GetChildrenRequest,
  GetAllChildrenNumberRequest,
  GetChildren2Request,
  CheckVersionRequest,
  GetMaxChildrenRequest,
  GetMaxChildrenResponse,
  SetMaxChildrenRequest,
  SyncRequest,
  SyncResponse,
  GetACLRequest,
  SetACLRequest,
  SetACLResponse,
  WatcherEvent,
  ErrorResponse,
  CreateResponse,
  Create2Response,
  ExistsRequest,
  ExistsResponse,
  GetDataResponse,
  GetChildrenResponse,
  GetAllChildrenNumberResponse,
  GetChildren2Response,
  GetACLResponse,
  CheckWatchesRequest,
  RemoveWatchesRequest,
  GetEphemeralsRequest,
  GetEphemeralsResponse,
};

export default {
  boolean,
  buffer,
  int,
  long,
  ustring,
  vector,

  basic,

  data,
  proto,
};
