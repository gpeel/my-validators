import {Injectable} from '@angular/core';
import {MyAlertServiceInterface} from './alert-api';

@Injectable()
export class DefaultAlertService implements MyAlertServiceInterface {
  public warn(msg: any): void {
    // console.log('WARNNNNNNNNNNNNNNNNNNNNNNNNNNNNN', msg);
  }
}
