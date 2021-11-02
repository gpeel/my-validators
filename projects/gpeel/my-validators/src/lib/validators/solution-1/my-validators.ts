/**
 * GAUTHIER PEEL : copied form version 9.1.1
 * MyValidators now compute an error message in the same time they are executed
 *
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵisObservable as isObservable, ɵisPromise as isPromise} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {forkJoin, from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

// import {AsyncValidatorFn, ValidationErrors, Validator, ValidatorFn} from './directives/validators';
// import {AbstractControl, FormControl} from './model';

export function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}


/**
 * A regular expression that matches valid e-mail addresses.
 * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
 */
const EMAIL_REGEXP =
  // eslint-disable-next-line max-len
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


export class MyValidators {

  /**
   * @description
   * Validator that requires the control's value to be greater than or equal to the provided number.
   * The validator exists only as a function and not as a directive.
   *
   * @usageNotes
   *
   * ### Validate against a minimum of 3
   *
   * ```typescript
   * const control = new FormControl(2, MyValidators.min(3));
   *
   * console.log(control.errors); // {min: {min: 3, actual: 2}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `min` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static min(min: number): ValidatorFn {
    const f = function(control: AbstractControl): ValidationErrors | null {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const value = parseFloat(control.value);
      // Controls with NaN values after parsing should be treated as not having a
      // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
      return !isNaN(value) && value < min ? {
        min: {
          min,
          actual: control.value,
          msg: `the number must be more or equal than ${min}`
        }
      } : null;
    };
    return f;
  }

  /**
   * @description
   * Validator that requires the control's value to be less than or equal to the provided number.
   * The validator exists only as a function and not as a directive.
   *
   * @usageNotes
   *
   * ### Validate against a maximum of 15
   *
   * ```typescript
   * const control = new FormControl(16, MyValidators.max(15));
   *
   * console.log(control.errors); // {max: {max: 15, actual: 16}}
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `max` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static max(max: number): ValidatorFn {
    const f = (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const value = parseFloat(control.value);
      // Controls with NaN values after parsing should be treated as not having a
      // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
      return !isNaN(value) && value > max ? {
        max: {
          max,
          actual: control.value,
          msg: `the number must be less or equal than ${max}`
        }
      } : null;
    };
    return f;
  }

  /**
   * @description
   * Validator that requires the control have a non-empty value.
   *
   * @usageNotes
   *
   * ### Validate that the field is non-empty
   *
   * ```typescript
   * const control = new FormControl('', MyValidators.required);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map with the `required` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyInputValue(control.value) ? {
      required: {msg: 'the field could not be empty'},
    } : null;
  }

  /**
   * @description
   * Validator that requires the control's value be true. This validator is commonly
   * used for required checkboxes.
   *
   * @usageNotes
   *
   * ### Validate that the field value is true
   *
   * ```typescript
   * const control = new FormControl('', MyValidators.requiredTrue);
   *
   * console.log(control.errors); // {required: true}
   * ```
   *
   * @returns An error map that contains the `required` property
   * set to `true` if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static requiredTrue(control: AbstractControl): ValidationErrors | null {
    return control.value === true ? null : {required: {msg: 'the field should be true'}};
  }

  /**
   * @description
   * Validator that requires the control's value pass an email validation test.
   *
   * Tests the value using a [regular
   * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
   * pattern suitable for common usecases. The pattern is based on the definition of a valid email
   * address in the [WHATWG HTML
   * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
   * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
   * lengths of different parts of the address).
   *
   * The differences from the WHATWG version include:
   * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
   * - Disallow `local-part` to be longer than 64 characters.
   * - Disallow the whole address to be longer than 254 characters.
   *
   * If this pattern does not satisfy your business needs, you can use `MyValidators.pattern()` to
   * validate the value against a different pattern.
   *
   * @usageNotes
   *
   * ### Validate that the field matches a valid email pattern
   *
   * ```typescript
   * const control = new FormControl('bad@', MyValidators.email);
   *
   * console.log(control.errors); // {email: true}
   * ```
   *
   * @returns An error map with the `email` property
   * if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static email(control: AbstractControl): ValidationErrors | null {
    if (isEmptyInputValue(control.value)) {
      return null;  // don't validate empty values to allow optional controls
    }
    return EMAIL_REGEXP.test(control.value) ? null : {email: {msg: 'the field should be a valid email'}};
  }

  /**
   * @description
   * Validator that requires the length of the control's value to be greater than or equal
   * to the provided minimum length. This validator is also provided by default if you use the
   * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
   * only for types that have a numeric `length` property, such as strings or arrays. The
   * `minLength` validator logic is also not invoked for values when their `length` property is 0
   * (for example in case of an empty string or an empty array), to support optional controls. You
   * can use the standard `required` validator if empty values should not be considered valid.
   *
   * @usageNotes
   *
   * ### Validate that the field has a minimum of 3 characters
   *
   * ```typescript
   * const control = new FormControl('ng', MyValidators.minLength(3));
   *
   * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
   * ```
   *
   * ```html
   * <input minlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `minlength` if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static minLength(minLength: number): ValidatorFn {
    const f = (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const length: number = control.value ? control.value.length : 0;
      return length < minLength ?
        {
          minlength:
            {
              requiredLength: minLength,
              actualLength: length,
              msg: `the length should be more than ${minLength} characters`
            }
        } :
        null;
    };
    return f;
  }

  /**
   * @description
   * Validator that requires the length of the control's value to be less than or equal
   * to the provided maximum length. This validator is also provided by default if you use the
   * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
   * only for types that have a numeric `length` property, such as strings or arrays.
   *
   * @usageNotes
   *
   * ### Validate that the field has maximum of 5 characters
   *
   * ```typescript
   * const control = new FormControl('Angular', MyValidators.maxLength(5));
   *
   * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
   * ```
   *
   * ```html
   * <input maxlength="5">
   * ```
   *
   * @returns A validator function that returns an error map with the
   * `maxlength` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static maxLength(maxLength: number): ValidatorFn {
    const f = (control: AbstractControl): ValidationErrors | null => {
      const length: number = control.value ? control.value.length : 0;
      return length > maxLength ?
        {
          maxlength:
            {
              requiredLength: maxLength,
              actualLength: length,
              msg: `the lenth should be less than ${length} characters`
            }
        } :
        null;
    };
    return f;
  }

  /**
   * @description
   * Validator that requires the control's value to match a regex pattern. This validator is also
   * provided by default if you use the HTML5 `pattern` attribute.
   *
   * @usageNotes
   *
   * ### Validate that the field only contains letters or spaces
   *
   * ```typescript
   * const control = new FormControl('1', MyValidators.pattern('[a-zA-Z ]*'));
   *
   * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
   * ```
   *
   * ```html
   * <input pattern="[a-zA-Z ]*">
   * ```
   *
   * @param pattern A regular expression to be used as is to test the values, or a string.
   * If a string is passed, the `^` character is prepended and the `$` character is
   * appended to the provided string (if not already present), and the resulting regular
   * expression is used to test the values.
   *
   * @returns A validator function that returns an error map with the
   * `pattern` property if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static pattern(pattern: string | RegExp): ValidatorFn {
    if (!pattern) {
      return MyValidators.nullValidator;
    }
    let regex: RegExp;
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

      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    const f = (control: AbstractControl): ValidationErrors | null => {
      if (isEmptyInputValue(control.value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const value: string = control.value;
      return regex.test(value) ? null :
        {
          pattern:
            {
              requiredPattern: regexStr,
              actualValue: value,
              msg: `the field should respect the pattern ${regexStr} `
            }
        };
    };
    return f;
  }

  /**
   * @description
   * Validator that performs no operation.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static nullValidator(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  /**
   * @description
   * Compose multiple validators into a single function that returns the union
   * of the individual error maps for the provided control.
   *
   * @returns A validator function that returns an error map with the
   * merged error maps of the validators if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static compose(validators: null): null;
  static compose(validators: (ValidatorFn | null | undefined)[]): ValidatorFn | null;
  static compose(validators: (ValidatorFn | null | undefined)[] | null): ValidatorFn | null {
    if (!validators) {
      return null;
    }
    const presentValidators: ValidatorFn[] = validators.filter(isPresent) as any;
    if (presentValidators.length === 0) {
      return null;
    }

    return function(control: AbstractControl) {
      return _mergeErrors(_executeValidators(control, presentValidators));
    };
  }

  /**
   * @description
   * Compose multiple async validators into a single function that returns the union
   * of the individual error objects for the provided control.
   *
   * @returns A validator function that returns an error map with the
   * merged error objects of the async validators if the validation check fails, otherwise `null`.
   *
   * @see `updateValueAndValidity()`
   *
   */
  static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null {
    if (!validators) {
      return null;
    }
    const presentValidators: AsyncValidatorFn[] = validators.filter(isPresent) as any;
    if (presentValidators.length === 0) {
      return null;
    }

    return function(control: AbstractControl) {
      const observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
      return forkJoin(observables).pipe(map(_mergeErrors));
    };
  }
}

export function isPresent(o: any): boolean {
  return o != null;
}

export function toObservable(r: any): Observable<any> {
  const obs = isPromise(r) ? from(r) : r;
  if (!(isObservable(obs))) {
    throw new Error(`Expected validator to return Promise or Observable.`);
  }
  return obs;
}

// eslint-disable-next-line no-underscore-dangle
export function _executeValidators(control: AbstractControl, validators: ValidatorFn[]): any[] {
  return validators.map(v => v(control));
}

// eslint-disable-next-line no-underscore-dangle
export function _executeAsyncValidators(control: AbstractControl, validators: AsyncValidatorFn[]): any[] {
  return validators.map(v => v(control));
}

// eslint-disable-next-line no-underscore-dangle
export function _mergeErrors(arrayOfErrors: ValidationErrors[]): ValidationErrors | null {
  let res: { [key: string]: any } = {};

  // Not using Array.reduce here due to a Chrome 80 bug
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
  arrayOfErrors.forEach((errors: ValidationErrors | null) => {
    res = errors != null ? {...res!, ...errors} : res!;
  });

  return Object.keys(res).length === 0 ? null : res;
}
