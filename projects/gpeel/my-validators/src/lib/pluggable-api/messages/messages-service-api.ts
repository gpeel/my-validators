import {InjectionToken} from '@angular/core';
import {ErrorMsgMap} from '../../error-messages/error-msg-api';

export interface MyMessagesServiceInterface {
  getValidationMessageFor(key: string, errors?: ErrorMsgMap): string;
}

export const MY_MESSAGES_SERVICE_API = new InjectionToken<MyMessagesServiceInterface>('MyMessagesService');
