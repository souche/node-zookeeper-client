/**
 * xiedacon created at 2019-11-03 17:23:23
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import RequestRecord from './RequestRecord';

export default class EmptyRequestRecord extends RequestRecord {

  constructor() {
    super([]);
  }

  setChrootPath(path: string) {}

  serialize() {
    return Buffer.alloc(0);
  }

  setValue(value: any) {}

  clear() {}

}
