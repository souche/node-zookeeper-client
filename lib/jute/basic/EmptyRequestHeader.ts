/**
 * xiedacon created at 2019-11-03 17:43:33
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import RequestHeader from '../proto/RequestHeader';

export default class EmptyRequestHeader extends RequestHeader {

  setChrootPath(path: string) {}

  serialize() {
    return Buffer.alloc(0);
  }

  setValue(value: any) {}

  clear() {}

}
