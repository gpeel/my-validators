import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {MyValidatorsServiceInterface} from '../validators-service-api';

@Injectable()
export class HardCodedMsgValidatorsService implements MyValidatorsServiceInterface {

  email(control: AbstractControl): ValidationErrors | null {
    const va = Validators.email(control);
    if (va) {
      return {email: {msg: 'the field should be a valid email'}};
    } else {
      return null;
    }
  }

  max(max: number): ValidatorFn {
    const maxClosure = Validators.max(max);
    const f = function(control: AbstractControl): ValidationErrors | null {
      const va = maxClosure(control);
      if (va) {
        return {max: {...va.max, msg: `the number must be more or equal than ${max}`}};
      } else {
        return null;
      }
    };
    return f;
  }

  min(min: number): ValidatorFn {
    const minClosure = Validators.min(min);
    const f = function(control: AbstractControl): ValidationErrors | null {
      const va = minClosure(control);
      if (va) {
        return {min: {...va.min, msg: `the number must be more or equal than ${min}`}};
      } else {
        return null;
      }
    };
    return f;
  }

  maxLength(maxLength: number): ValidatorFn {
    const maxClosure = Validators.maxLength(maxLength);
    const f = function(control: AbstractControl): ValidationErrors | null {
      const va = maxClosure(control);
      if (va) {
        return {maxlength: {...va.maxlength, msg: `the length should be less than ${maxLength} characters`}};
      } else {
        return null;
      }
    };
    return f;
  }


  minLength(minLength: number): ValidatorFn {
    const minClosure = Validators.minLength(minLength);
    const f = function(control: AbstractControl): ValidationErrors | null {
      const va = minClosure(control);
      if (va) {
        return {minlength: {...va.minlength, msg: `the length should be more than ${minLength} characters`}};
      } else {
        return null;
      }
    };
    return f;
  }

  nullValidator(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  pattern(pattern: string | RegExp): ValidatorFn {
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

    const f = function(control: AbstractControl): ValidationErrors | null {
      const va = pattClosure(control);
      if (va) {
        return {pattern: {...va.pattern, msg: `the field should respect the pattern ${regexStr}`}};
      } else {
        return null;
      }
    };
    return f;
  }

  required(control: AbstractControl): ValidationErrors | null {
    const va = Validators.required(control);
    if (va) {
      return {required: {msg: 'the field is required'}};
    } else {
      return null;
    }
  }

  requiredTrue(control: AbstractControl): ValidationErrors | null {
    const va = Validators.requiredTrue(control);
    if (va) {
      return {required: {msg: 'the field should be true'}};
    } else {
      return null;
    }
  }

}
