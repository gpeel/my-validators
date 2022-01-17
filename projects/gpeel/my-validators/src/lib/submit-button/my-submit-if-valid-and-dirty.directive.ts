import {Directive, EventEmitter, Inject, Injector, Optional, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {MY_ALERT_SERVICE_API, MyAlertServiceInterface} from '../pluggable-api/alert/alert-api';
import {MY_MESSAGES_SERVICE_API, MyMessagesServiceInterface} from '../pluggable-api/messages/messages-service-api';
import {SubmitIfAbstractDirective} from './submit-if-abstract.directive';

/**
 * Usage : replace
 * <button (click)="onSaveByContainer()">save</button>
 * by :
 * <button (mySubmitIfValidAndDirty)="onYourLocalMethod()">save</button>
 *
 * Effect: the button should not be not disabled, then when clicking on the button,
 * this directive will turn dirty all FormControl on the encapsulating \<form>.
 * Doing that will make any validation error messgae appear.
 * If the form.valid is true => the event (mySubmitIfValidAndDirty) is emitted,
 * so the save() method is only then executed.
 * An alertService is invoked  (if provided on MY_ALERT_SERVICE_API Token)
 *     {
 *       provide: MY_ALERT_SERVICE_API,
 *       useClass: DefaultAlertService
 *     },
 *  with import {MY_ALERT_SERVICE_API} from './pluggable-api/alert/alert-api';
 *
 * - if the form is not valid, it will show the message : 'You must correct your form before saving it'.
 * - if the form is pristine, it will show the message : 'Your FORM is pristine! No action executed';
 *
 * You can also provide a MessageService implemeting MyMessagesServiceInterface,
 * if you do, return a message or the keys 'pristineForm' and 'invalidForm' to the method
 * getValidationMessageFor(key: string, errors?: ErrorMsgMap): string;
 *
 * For example :
 *   pristineForm: 'Your form is pristine! No action executed',
 *   invalidForm: 'You must correct your form before saving it',
 *
 *   => it is activated in MyValidatorsModule
 *   {
 *     provide: MY_MESSAGES_SERVICE_API,
 *     useClass: DefaultMessagesService
 *   }
 *   with import { MY_MESSAGES_SERVICE_API } from './pluggable-api/messages/messages-service-api';
 */
@Directive({
  selector: '[mySubmitIfValidAndDirty]'
})
export class MySubmitIfValidAndDirtyDirective extends SubmitIfAbstractDirective {

  @Output('mySubmitIfValidAndDirty') valid = new EventEmitter<void>();

  constructor(injector: Injector,
              @Optional() @Inject(MY_ALERT_SERVICE_API) private alertService: MyAlertServiceInterface,
              @Optional() @Inject(MY_MESSAGES_SERVICE_API) private messageService: MyMessagesServiceInterface,
  ) {
    super(injector);
  }

  executeBehavior(form: FormGroup) {
    const pristine = form.pristine;
    let msgToWarnIfAny: string;
    if (pristine) {
      if (this.messageService) {
        msgToWarnIfAny = this.messageService.getValidationMessageFor('pristineForm');
      } else {
        msgToWarnIfAny = 'Your form is pristine! No action executed';
      }
      Plog.warn(msgToWarnIfAny);

      if (form.invalid) {
        super.makeDirty(form); // make all dirty
      }
      if (this.alertService) {
        this.alertService.warn(msgToWarnIfAny);
      }
      return;
    }

    // so !pristine here
    if (form.valid && !pristine) {
      this.valid.emit();
    } else {
      if (this.messageService) {
        msgToWarnIfAny = this.messageService.getValidationMessageFor('invalidForm');
      } else {
        msgToWarnIfAny = 'You must correct your form before saving it';
      }
      Plog.warn(msgToWarnIfAny);
      super.makeDirty(form); // make all dirty
      if (this.alertService) {
        this.alertService.warn(msgToWarnIfAny);
      }
    }

  }

}
