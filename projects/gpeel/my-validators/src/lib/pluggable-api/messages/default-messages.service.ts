import {Injectable} from '@angular/core';
// noinspection ES6PreferShortImport
import {ErrorMsgMap} from '../../error-messages/error-msg-api';
import {MyMessagesServiceInterface} from './messages-service-api';


export const I18N_MESSAGES: ErrorMsgMap = {

  // messages for the submit button
  pristineForm: 'Your form is pristine! No action executed',
  invalidForm: 'You must correct your form before saving it',

  // validators
  email: 'the field should be a valid email',
  required: 'the field is required',
  requiredTrue: 'the field should be true', // real key is also 'required'
  max: (errorsValue: any) => `the number must be more or equal than ${errorsValue.max}`,
  min: (errorsValue: any) => `the number must be less or equal than ${errorsValue.min}`,
  maxlength: (errorsValue: any) => `the length should be less than ${errorsValue.requiredLength} characters`,
  minlength: (errorsValue: any) => `the length should be more than ${errorsValue.requiredLength} characters`,
  pattern: (errorsValue: any) => `the field should respect the pattern ${errorsValue.requiredPattern}`,

};

@Injectable()
export class DefaultMessagesService implements MyMessagesServiceInterface {

  getValidationMessageFor(key: string, errors: ErrorMsgMap | null = null): string {
    const m = I18N_MESSAGES[key];
    if (typeof m === 'string') {
      return m; // typeof undefined is string 'undefined' that will appear in the case the key is not found.
    } else if (typeof m === 'function') {
      return m(errors);
    } else {
      return `key \'${key}\' undefined in your MyMessageService implementation`;
    }
  }

}
