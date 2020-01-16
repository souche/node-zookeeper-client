/**
 * xiedacon created at 2019-11-03 17:23:23
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

import ResponseRecord from './ResponseRecord';

export default class EmptyResponseRecord extends ResponseRecord {

  constructor() {
    super([]);
  }

  setChrootPath(path: string) {}

  deserialize(buffer: Buffer, offset = 0) {
    return 0;
  }

  setValue(value: any) {}

  clear() {}

}
