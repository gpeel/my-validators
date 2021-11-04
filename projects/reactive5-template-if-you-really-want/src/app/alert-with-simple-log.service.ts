import {Injectable} from '@angular/core';
import {Plog} from '@gpeel/plog';

@Injectable({
  providedIn: 'root'
})
export class AlertWithSimpleLogService {

  constructor() {
    Plog.createComponent('AlertWithSimpleLogService');
  }

  warn(...msg: string[]) {
    // console.log(...msg);
    alert(...msg);
  }

}
