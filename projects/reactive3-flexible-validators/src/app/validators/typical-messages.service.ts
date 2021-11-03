import {Injectable} from '@angular/core';
import {ErrorMsgMap, MyMessagesServiceInterface} from '@gpeel/my-validators';

export const FULL_MESSAGES: ErrorMsgMap = {

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


@Injectable()
export class TypicalMessagesService implements MyMessagesServiceInterface {

  getValidationMessageFor(key: string, errors?: ErrorMsgMap): string {
    const m = FULL_MESSAGES[key];
    if (typeof m === 'string') {
      return m; // typeof undefined is string 'undefined' that will appear in the case the key is not found.
    } else if (typeof m === 'function') {
      return m(errors);
    } else {
      return `key \'${key}\' undefined in your MyMessageService implementation`;
    }
  }

}
