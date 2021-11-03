import {Directive, EventEmitter, Inject, Injector, Optional, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {MY_ALERT_SERVICE_API, MyAlertServiceInterface} from '../pluggable-api/alert/alert-api';
import {SubmitIfAbstractDirective} from './submit-if-abstract.directive';

// // usually AlertModule is in ./libs

/**
 * Usage : replace
 * <button (click)="onSaveByContainer()">save</button>
 * by :
 * <button (peeSubmitIfValid)="onSaveByContainer(form)">save</button>
 *
 * Effect: the button is not disabled, so when clicking this directive will
 * make any validation error to appear on Validation Messages
 * so the user could correct its inputs to make it valid.
 * If the form.valid is true => the event (tsSubmitIfValid) is emitted,
 * so the save() method is only then executed.
 * An alertService is invoked  (if provided on MY_ALERT_SERVICE_API)
 * - if not valid to show the messages : 'You must correct your form before saving it'.
 * - if pristine to show the messages : 'Your FORM is pristine! No action executed';
 */
@Directive({
  selector: '[mySubmitIfValid]'
})
export class MySubmitIfValidDirective extends SubmitIfAbstractDirective {

  @Output('mySubmitIfValid') valid = new EventEmitter<void>(); // tslint:disable-line:no-output-rename

  constructor(injector: Injector,
              @Optional() @Inject(MY_ALERT_SERVICE_API) private alertService: MyAlertServiceInterface) {
    super(injector);
  }

  executeBehavior(form: FormGroup) {
    super.makeDirty(form);
    if (form.valid) {
      this.valid.emit();
    } else {
      const m = 'You must correct your form before saving it';
      Plog.warn(m);
      if (this.alertService) {
        this.alertService.warn(m);
      }
    }
  }

}
