import {Directive, EventEmitter, Inject, Injector, Optional, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {MY_ALERT_SERVICE_API, MyAlertServiceInterface} from '../alert/alert-api';
import {MY_MESSAGES_SERVICE_API, MyMessagesServiceInterface} from '../validators/messages-service-api';
import {SubmitIfAbstractDirective} from './submit-if-abstract.directive';

// // usually AlertModule is in ./libs

/**
 * Usage : replace
 * <button (click)="onSaveByContainer()">save</button>
 * by :
 * <button (mySubmitIfValidAndDirty)="onYourLocalMethod()">save</button>
 *
 * Effect: the button is not disabled, so when clicking this directive will
 * make any validation error to appear on Validation Messages
 * so the user could correct its inputs to make it valid.
 * If the form.valid is true => the event (tsSubmitIfValid) is emitted,
 * so the save() method is only then executed.
 * An alertService is invoked  (if provided on MY_ALERT_SERVICE_API)
 * - if not valid to show the message : 'You must correct your form before saving it'.
 * - if pristine to show the message : 'Your FORM is pristine! No action executed';
 *
 *   // REQUIRED messages for the submit button in the default message service
 *   pristineForm: 'Your form is pristine! No action executed',
 *   invalidForm: 'You must correct your form before saving it',
 *
 *   => it is activated in MyValidatorsModule
 *   {
 *     provide: MY_MESSAGES_SERVICE_API,
 *     useClass: DefaultMessagesService
 *   }
 */
@Directive({
  selector: '[mySubmitIfValidAndDirty]'
})
export class MySubmitIfValidAndDirtyDirective extends SubmitIfAbstractDirective {

  @Output('mySubmitIfValidAndDirty') valid = new EventEmitter<void>(); // tslint:disable-line:no-output-rename

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
