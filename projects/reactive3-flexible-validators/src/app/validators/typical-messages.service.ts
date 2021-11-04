import {Injectable} from '@angular/core';
import {ErrorMsgMap, MyMessagesServiceInterface} from '@gpeel/my-validators';

const FR_MESSAGES: ErrorMsgMap = {

  forbiddenName: (errorsValue: any) => `le mot ${errorsValue.forbiddenName} est interdit`,

  // messages for the submit button (mySubmitIfValidAndDirty)
  // projects/gpeel/my-validators/src/lib/submit-button/my-submit-if-valid-and-dirty.directive.ts
  pristineForm: 'Le formulaire est inchangé. Pas d\'action executée !',
  invalidForm: 'Vous devez corriger le formulaire pour qu\'il soit soumis !',

  email: 'le champ doit être un email valid',
  required: 'le champ est requis',
  requiredTrue: 'le champ doit être true', // real key is also 'required'
  max: (errorsValue: any) => `le nombre doit être au moins ${errorsValue.max}`,
  min: (errorsValue: any) => `le nombre doit être au plus ${errorsValue.min}`,
  minlength: (errorsValue: any) => `le nombre de caractères doit être supérieur à ${errorsValue.requiredLength}`,
  maxlength: (errorsValue: any) => `le nombre de caractères doit être inférieur à  ${errorsValue.requiredLength}`,
  pattern: (errorsValue: any) => `le champ doit respecter le pattern ${errorsValue.requiredPattern}`,
};


const EN_MESSAGES: ErrorMsgMap = {

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
export class TypicalMessagesService implements MyMessagesServiceInterface {

  getValidationMessageFor(key: string, errors?: ErrorMsgMap): string {
    const m = FR_MESSAGES[key];
    if (typeof m === 'string') {
      return m; // typeof undefined is string 'undefined' that will appear in the case the key is not found.
    } else if (typeof m === 'function') {
      return m(errors);
    } else {
      return `key \'${key}\' undefined in your MyMessageService implementation`;
    }
  }

}
