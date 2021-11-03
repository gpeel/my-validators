import {Inject, Injectable, Optional} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MY_MESSAGES_SERVICE_API, MyMessagesServiceInterface} from '../messages/messages-service-api';
import {MyValidatorsServiceInterface} from './validators-service-api';

/**
 * This DefaultValidatorsService could be used to code a full custom  MyValidatorsServiceInterface.
 * BUT you could  code a custom Service for MyI18nMessagesServiceInterface,
 * and  override all your string Messages for all validators.
 * In that case you have to provide it like:
 * <pre>
 *     {
 *     provide: MY_I18N_MESSAGES_SERVICE_API,
 *     useFactory: myI18nMessageServiceFactory,
 *     deps: [CUSTOMI18nMessagesService]
 *   }
 *
 *   export function myI18nMessageServiceFactory(messageService: MyI18nMessagesServiceInterface) {
 *      return messageService;
 *   }
 * <pre>
 *
 *   This king of provide enables the DefaultValidatorsService to use YOUR CUSTOM MyI18nMessagesServiceInterface
 *   instead of the DefaultI18nMessagesService.
 *
 * NOTE : all the methods should be either "binded" to this (method.bind(this), or arrow function (solution I chosed)
 * to keep the 'this' being the instance of DefaultValidatorsService.
 */
@Injectable()
export class DefaultValidatorsService implements MyValidatorsServiceInterface {

  constructor(@Optional() @Inject(MY_MESSAGES_SERVICE_API) private myMessagesService: MyMessagesServiceInterface) {
  }

  email = (control: AbstractControl): ValidationErrors | null => {
    const va = Validators.email(control);
    if (va) {
      // if the Token MY_MESSAGES_SERVICE_API is not provided, I fallback to hard-coded messages in English
      let i18nMsg = 'the field should be a valid email';
      if (this.myMessagesService) {
        i18nMsg = this.myMessagesService.getValidationMessageFor('email', va.email);
      }
      return {email: {msg: i18nMsg}};
    } else {
      return null;
    }
  };

  max = (max: number): ValidatorFn => {
    const maxClosure = Validators.max(max);
    const f = (control: AbstractControl): ValidationErrors | null => {
      const va = maxClosure(control);
      if (va) {
        let i18nMsg = `the number must be more or equal than ${va.max}`;
        if (this.myMessagesService) {
          i18nMsg = this.myMessagesService.getValidationMessageFor('max', va.max);
        }
        return {max: {...va.max, msg: i18nMsg}};
      } else {
        return null;
      }
    };
    return f;
  };

  min = (min: number): ValidatorFn => {
    const minClosure = Validators.min(min);
    const f = (control: AbstractControl): ValidationErrors | null => {
      const va = minClosure(control);
      if (va) {
        let i18nMsg = `the number must be less or equal than ${va.min}`;
        if (this.myMessagesService) {
          i18nMsg = this.myMessagesService.getValidationMessageFor('min', va.main);
        }
        return {min: {...va.min, msg: i18nMsg}};
      } else {
        return null;
      }
    };
    return f;
  };

  maxLength = (maxLength: number): ValidatorFn => {
    const maxClosure = Validators.maxLength(maxLength);
    const f = (control: AbstractControl): ValidationErrors | null => {
      const va = maxClosure(control);
      if (va) {
        let i18nMsg = `the length should be less than ${va.requiredLength} characters`;
        if (this.myMessagesService) {
          i18nMsg = this.myMessagesService.getValidationMessageFor('maxlength', va.maxlength);
        }
        return {maxlength: {...va.maxlength, msg: i18nMsg}};
      } else {
        return null;
      }
    };
    return f;
  };


  minLength = (minLength: number): ValidatorFn => {
    const minClosure = Validators.minLength(minLength);
    const f = (control: AbstractControl): ValidationErrors | null => {
      const va = minClosure(control);
      if (va) {
        let i18nMsg = `the length should be more than ${va.requiredLength} characters`;
        if (this.myMessagesService) {
          i18nMsg = this.myMessagesService.getValidationMessageFor('minlength', va.minlength);
        }
        return {minlength: {...va.minlength, msg: i18nMsg}};
      } else {
        return null;
      }
    };
    return f;
  };

  nullValidator(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  pattern = (pattern: string | RegExp): ValidatorFn => {
    const pattClosure = Validators.pattern(pattern);

    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = '';

      if (pattern.charAt(0) !== '^') {
        regexStr += '^';
      }
      regexStr += pattern;

      if (pattern.charAt(pattern.length - 1) !== '$') {
        regexStr += '$';
      }

    } else {
      regexStr = pattern.toString();
    }

    const f = (control: AbstractControl): ValidationErrors | null => {
      const va = pattClosure(control);
      if (va) {
        let i18nMsg = `the field should respect the pattern ${va.requiredPattern}`;
        if (this.myMessagesService) {
          i18nMsg = this.myMessagesService.getValidationMessageFor('pattern', va.pattern);
        }
        return {pattern: {...va.pattern, msg: i18nMsg}};
      } else {
        return null;
      }
    };
    return f;
  };

  required = (control: AbstractControl): ValidationErrors | null => {
    const va = Validators.required(control);
    if (va) {
      let i18nMsg = 'the field is required';
      if (this.myMessagesService) {
        i18nMsg = this.myMessagesService.getValidationMessageFor('required', va.required);
      }
      return {required: {msg: i18nMsg}};
    } else {
      return null;
    }
  };

  requiredTrue = (control: AbstractControl): ValidationErrors | null => {
    const va = Validators.requiredTrue(control);
    if (va) {
      let i18nMsg = 'the field should be true';
      if (this.myMessagesService) {
        i18nMsg = this.myMessagesService.getValidationMessageFor('requiredTrue', va.required);
      }
      return {required: {msg: i18nMsg}};
    } else {
      return null;
    }
  };

}
