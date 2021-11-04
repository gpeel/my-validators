import {Injectable} from '@angular/core';
import {Plog} from '@gpeel/plog';

@Injectable()
export class AlertWithSimpleLogService {

  constructor() {
    Plog.createComponent('AlertWithSimpleLogService');
  }

  warn(...msg: string[]) {
    // console.log(...msg);
    alert(...msg);
  }

}
