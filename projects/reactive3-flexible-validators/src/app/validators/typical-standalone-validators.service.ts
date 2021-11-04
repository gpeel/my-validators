import {Inject, Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MY_MESSAGES_SERVICE_API, MyMessagesServiceInterface, MyValidatorsServiceInterface} from '@gpeel/my-validators';

/**
 * ValidatorsService will be used to define ALL validators in a project.
 * You can get inherited standard validators methods : required, minLength ...etc.
 * But you can also want to have ALL code inline (and kip inheritance)
 * Here is that example
 */
@Injectable()
export class TypicalStandaloneValidatorsService implements MyValidatorsServiceInterface {

  // constructor(private  myMessagesService: I18nMessagesService) {
  constructor(@Inject(MY_MESSAGES_SERVICE_API) private myMessagesService: MyMessagesServiceInterface) {
  }

  // Arrow-function required to use "this" ! by NG
  myCustomValidatorForbiddenName = (control: AbstractControl): ValidationErrors | null => {
    if (control.value?.includes('toto')) {
      // console.log('TOTO!!!!!!!!!!!!!!!!!!!!!!!!');
      // FULL hard coded message here
      // return {myCustomValidator: {msg: 'Toto is forbidden'}};
      // or factorized in I18nCustomMessagesService
      // THIS HERE !!!
      return {forbiddenName: {msg: this.myMessagesService.getValidationMessageFor('forbiddenName', {forbiddenName: 'toto'})}};
    }
    return null;
  };

  /// ALL COPIED FROM


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
