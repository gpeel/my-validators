/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable  no-underscore-dangle */
/**
 * GAUTHIER PEEL : copied form version 9.1.1
 *
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, forwardRef, Input, OnChanges, SimpleChanges, StaticProvider} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from '@angular/forms';
import {MyValidators} from './my-validators';

export const REQUIRED_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyRequiredValidator),
  multi: true
};
export const CHECKBOX_REQUIRED_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyCheckboxRequiredValidator),
  multi: true
};

@Directive({
  selector:
    ':not([type=checkbox])[myRequired][formControlName],' +
    ':not([type=checkbox])[myRequired][formControl],' +
    ':not([type=checkbox])[myRequired][ngModel]',
  providers: [REQUIRED_VALIDATOR],
  host: {'[attr.required]': 'myRequired ? "" : null'}
})
export class MyRequiredValidator implements Validator {
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  // TODO(issue/24571): remove '!'.
  private _myRequired!: boolean;

  /**
   * @description
   * Tracks changes to the required attribute bound to this directive.
   */
  @Input()
  get myRequired(): boolean | string {

    return this._myRequired;
  }

  set myRequired(value: boolean | string) {
    this._myRequired = value != null && value !== false && `${value}` !== 'false';
    if (this._onChange) {
      this._onChange();
    }
  }

  /**
   * @description
   * Method that validates whether the control is empty.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.myRequired ? MyValidators.required(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

@Directive({
  selector:
    'input[type=checkbox][myRequired][formControlName],' +
    'input[type=checkbox][myRequired][formControl],' +
    'input[type=checkbox][myRequired][ngModel]',
  providers: [CHECKBOX_REQUIRED_VALIDATOR],
  host: {'[attr.required]': 'myRequired ? "" : null'}
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MyCheckboxRequiredValidator extends MyRequiredValidator {
  /**
   * @description
   * Method that validates whether or not the checkbox has been checked.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.myRequired ? MyValidators.requiredTrue(control) : null;
  }
}

export const EMAIL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyEmailValidator),
  multi: true
};

@Directive({
  selector: '[myEmail][formControlName],[myEmail][formControl],[myEmail][ngModel]',
  providers: [EMAIL_VALIDATOR]
})
export class MyEmailValidator implements Validator {
  // TODO(issue/24571): remove '!'.
  private _enabled!: boolean;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the email attribute bound to this directive.
   */
  @Input()
  set myEmail(value: boolean | string) {
    this._enabled = value === '' || value === true || value === 'true';
    if (this._onChange) {
      this._onChange();
    }
  }

  /**
   * @description
   * Method that validates whether an email address is valid.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this._enabled ? MyValidators.email(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

export const MIN_LENGTH_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyMinLengthValidator),
  multi: true
};

@Directive({
  selector: '[myMinlength][formControlName],[myMinlength][formControl],[myMinlength][ngModel]',
  providers: [MIN_LENGTH_VALIDATOR],
  host: {'[attr.minlength]': 'myMinlength ? myMinlength : null'}
})
export class MyMinLengthValidator implements Validator, OnChanges {
  /**
   * @description
   * Tracks changes to the the minimum length bound to this directive.
   */
    // TODO(issue/24571): remove '!'.
  @Input() myMinlength!: string | number;
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('myMinlength' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  /**
   * @description
   * Method that validates whether the value meets a minimum length
   * requirement. Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.myMinlength == null ? null : this._validator(control);
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = MyValidators.minLength(
      typeof this.myMinlength === 'number' ? this.myMinlength : parseInt(this.myMinlength, 10));
  }
}

export const MAX_LENGTH_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyMaxLengthValidator),
  multi: true
};

@Directive({
  selector: '[myMaxlength][formControlName],[myMaxlength][formControl],[myMaxlength][ngModel]',
  providers: [MAX_LENGTH_VALIDATOR],
  host: {'[attr.maxlength]': 'myMaxlength ? myMaxlength : null'}
})
export class MyMaxLengthValidator implements Validator, OnChanges {
  /**
   * @description
   * Tracks changes to the the maximum length bound to this directive.
   */
    // TODO(issue/24571): remove '!'.
  @Input() myMaxlength!: string | number;
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('maxlength' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  /**
   * @description
   * Method that validates whether the value exceeds
   * the maximum length requirement.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.myMaxlength != null ? this._validator(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = MyValidators.maxLength(
      typeof this.myMaxlength === 'number' ? this.myMaxlength : parseInt(this.myMaxlength, 10));
  }
}

export const PATTERN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MyPatternValidator),
  multi: true
};

@Directive({
  selector: '[myPattern][formControlName],[myPattern][formControl],[myPattern][ngModel]',
  providers: [PATTERN_VALIDATOR],
  host: {'[attr.pattern]': 'myPattern ? myPattern : null'}
})
export class MyPatternValidator implements Validator, OnChanges {
  /**
   * @description
   * Tracks changes to the pattern bound to this directive.
   */
    // TODO(issue/24571): remove '!'.
  @Input() myPattern!: string | RegExp;
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('myPattern' in changes) {
      this._createValidator();
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  /**
   * @description
   * Method that validates whether the value matches the
   * the pattern requirement.
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this._validator(control);
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = MyValidators.pattern(this.myPattern);
  }
}
