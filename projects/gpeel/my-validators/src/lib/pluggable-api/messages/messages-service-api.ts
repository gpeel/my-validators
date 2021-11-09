import {InjectionToken} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {ErrorMsgMap} from '../../error-messages/error-msg-api';

export interface MyMessagesServiceInterface {
  getValidationMessageFor(key: string, errors?: ErrorMsgMap): string;
}

export const MY_MESSAGES_SERVICE_API = new InjectionToken<MyMessagesServiceInterface>('MyMessagesService');
export const MY_SHOW_ERROR_MSG_FUNCTION_API = new InjectionToken<MyMessagesServiceInterface>('MY_SHOW_ERROR_MSG_FUNCTION');


export type ShowFunction = (control: AbstractControl) => any;

export function DEFAULT_SHOW_ERROR_MSG_FUNCTION(control: AbstractControl) {
  return (control.dirty || control.touched);
}
