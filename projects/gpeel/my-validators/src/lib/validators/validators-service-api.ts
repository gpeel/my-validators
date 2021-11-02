import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export interface MyValidatorsServiceInterface {

  min(min: number): ValidatorFn;
  max(min: number): ValidatorFn;
  required(control: AbstractControl): ValidationErrors | null;
  requiredTrue(control: AbstractControl): ValidationErrors | null;
  email(control: AbstractControl): ValidationErrors | null;
  minLength(minLength: number): ValidatorFn;
  maxLength(minLength: number): ValidatorFn;
  pattern(pattern: string | RegExp): ValidatorFn;
  nullValidator(control: AbstractControl): ValidationErrors | null;
}

