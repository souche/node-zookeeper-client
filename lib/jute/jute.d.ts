/**
* This file created by ./bin/gen_types
* Do not modify this file!!!!!!!!!
 */

import _type from './basic/type';
import _object from './basic/object';
import _RequestRecord from './basic/RequestRecord';
import _ResponseRecord from './basic/ResponseRecord';
import _EmptyRequestRecord from './basic/EmptyRequestRecord';
import _EmptyResponseRecord from './basic/EmptyResponseRecord';
import _EmptyRequestHeader from './basic/EmptyRequestHeader';

export namespace basic {
  type type = _type;
  type object = _object;
  type RequestRecord = _RequestRecord;
  type ResponseRecord = _ResponseRecord;
  type EmptyRequestRecord = _EmptyRequestRecord;
  type EmptyResponseRecord = _EmptyResponseRecord;
  type EmptyRequestHeader = _EmptyRequestHeader;
}

import _boolean from './boolean';
import _buffer from './buffer';
import _int from './int';
import _long from './long';
import _ustring from './ustring';
import _vector from './vector';

export type boolean = _boolean;
export type buffer = _buffer;
export type int = _int;
export type long = _long;
export type ustring = _ustring;
export type vector = _vector;

import _Id from './data/Id';
import _ACL from './data/ACL';
import _Stat from './data/Stat';
import _StatPersisted from './data/StatPersisted';

export namespace data {
  type Id = _Id;
  type ACL = _ACL;
  type Stat = _Stat;
  type StatPersisted = _StatPersisted;
}

import _ConnectRequest from './proto/ConnectRequest';
import _ConnectResponse from './proto/ConnectResponse';
import _SetWatches from './proto/SetWatches';
import _RequestHeader from './proto/RequestHeader';
import _MultiHeader from './proto/MultiHeader';
import _AuthPacket from './proto/AuthPacket';
import _ReplyHeader from './proto/ReplyHeader';
import _GetDataRequest from './proto/GetDataRequest';
import _SetDataRequest from './proto/SetDataRequest';
import _ReconfigRequest from './proto/ReconfigRequest';
import _SetDataResponse from './proto/SetDataResponse';
import _GetSASLRequest from './proto/GetSASLRequest';
import _SetSASLRequest from './proto/SetSASLRequest';
import _SetSASLResponse from './proto/SetSASLResponse';
import _CreateRequest from './proto/CreateRequest';
import _CreateTTLRequest from './proto/CreateTTLRequest';
import _DeleteRequest from './proto/DeleteRequest';
import _GetChildrenRequest from './proto/GetChildrenRequest';
import _GetAllChildrenNumberRequest from './proto/GetAllChildrenNumberRequest';
import _GetChildren2Request from './proto/GetChildren2Request';
import _CheckVersionRequest from './proto/CheckVersionRequest';
import _GetMaxChildrenRequest from './proto/GetMaxChildrenRequest';
import _GetMaxChildrenResponse from './proto/GetMaxChildrenResponse';
import _SetMaxChildrenRequest from './proto/SetMaxChildrenRequest';
import _SyncRequest from './proto/SyncRequest';
import _SyncResponse from './proto/SyncResponse';
import _GetACLRequest from './proto/GetACLRequest';
import _SetACLRequest from './proto/SetACLRequest';
import _SetACLResponse from './proto/SetACLResponse';
import _WatcherEvent from './proto/WatcherEvent';
import _ErrorResponse from './proto/ErrorResponse';
import _CreateResponse from './proto/CreateResponse';
import _Create2Response from './proto/Create2Response';
import _ExistsRequest from './proto/ExistsRequest';
import _ExistsResponse from './proto/ExistsResponse';
import _GetDataResponse from './proto/GetDataResponse';
import _GetChildrenResponse from './proto/GetChildrenResponse';
import _GetAllChildrenNumberResponse from './proto/GetAllChildrenNumberResponse';
import _GetChildren2Response from './proto/GetChildren2Response';
import _GetACLResponse from './proto/GetACLResponse';
import _CheckWatchesRequest from './proto/CheckWatchesRequest';
import _RemoveWatchesRequest from './proto/RemoveWatchesRequest';
import _GetEphemeralsRequest from './proto/GetEphemeralsRequest';
import _GetEphemeralsResponse from './proto/GetEphemeralsResponse';

export namespace proto {
  type ConnectRequest = _ConnectRequest;
  type ConnectResponse = _ConnectResponse;
  type SetWatches = _SetWatches;
  type RequestHeader = _RequestHeader;
  type MultiHeader = _MultiHeader;
  type AuthPacket = _AuthPacket;
  type ReplyHeader = _ReplyHeader;
  type GetDataRequest = _GetDataRequest;
  type SetDataRequest = _SetDataRequest;
  type ReconfigRequest = _ReconfigRequest;
  type SetDataResponse = _SetDataResponse;
  type GetSASLRequest = _GetSASLRequest;
  type SetSASLRequest = _SetSASLRequest;
  type SetSASLResponse = _SetSASLResponse;
  type CreateRequest = _CreateRequest;
  type CreateTTLRequest = _CreateTTLRequest;
  type DeleteRequest = _DeleteRequest;
  type GetChildrenRequest = _GetChildrenRequest;
  type GetAllChildrenNumberRequest = _GetAllChildrenNumberRequest;
  type GetChildren2Request = _GetChildren2Request;
  type CheckVersionRequest = _CheckVersionRequest;
  type GetMaxChildrenRequest = _GetMaxChildrenRequest;
  type GetMaxChildrenResponse = _GetMaxChildrenResponse;
  type SetMaxChildrenRequest = _SetMaxChildrenRequest;
  type SyncRequest = _SyncRequest;
  type SyncResponse = _SyncResponse;
  type GetACLRequest = _GetACLRequest;
  type SetACLRequest = _SetACLRequest;
  type SetACLResponse = _SetACLResponse;
  type WatcherEvent = _WatcherEvent;
  type ErrorResponse = _ErrorResponse;
  type CreateResponse = _CreateResponse;
  type Create2Response = _Create2Response;
  type ExistsRequest = _ExistsRequest;
  type ExistsResponse = _ExistsResponse;
  type GetDataResponse = _GetDataResponse;
  type GetChildrenResponse = _GetChildrenResponse;
  type GetAllChildrenNumberResponse = _GetAllChildrenNumberResponse;
  type GetChildren2Response = _GetChildren2Response;
  type GetACLResponse = _GetACLResponse;
  type CheckWatchesRequest = _CheckWatchesRequest;
  type RemoveWatchesRequest = _RemoveWatchesRequest;
  type GetEphemeralsRequest = _GetEphemeralsRequest;
  type GetEphemeralsResponse = _GetEphemeralsResponse;
}

export as namespace Jute;
