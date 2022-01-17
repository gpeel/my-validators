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
 * Effect: the button is not disabled, so when clicking on the button, this directive will
 * make any validation error to appear on Validation Messages,
 * so the user could correct its inputs to make it valid.
 * If the form.valid is true => the event (tsSubmitIfValid) is emitted,
 * so the save() method is then executed.
 * An alertService is invoked  (if provided on MY_ALERT_SERVICE_API token)
 * - if the form is not valid, it will show the message : 'You must correct your form before saving it'.
 * - if the form is pristine, it will show the message : 'Your FORM is pristine! No action executed';
 */
@Directive({
  selector: '[mySubmitIfValid]'
})
export class MySubmitIfValidDirective extends SubmitIfAbstractDirective {

  @Output('mySubmitIfValid') valid = new EventEmitter<void>();

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
