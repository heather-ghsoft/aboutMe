import { Injectable } from '@angular/core';

@Injectable()
export class UtilService {

  constructor() {}

  getOrderTimeDesc(date) {
    return 9999999999999 - date.getTime();
  }
}