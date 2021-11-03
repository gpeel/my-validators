import {InjectionToken} from '@angular/core';

export interface MyAlertServiceInterface {
  warn(msg: any): void;
}

export const MY_ALERT_SERVICE_API = new InjectionToken<MyAlertServiceInterface>('MyAlert');

