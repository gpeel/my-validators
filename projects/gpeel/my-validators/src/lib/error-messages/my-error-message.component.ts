/* eslint-disable no-underscore-dangle */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {Subscription} from 'rxjs';
import {ErrorMsgFn, ErrorMsgMap} from './error-msg-api';

/**
 * Use:
 * It is REQUIRED to use the directve myErrorMsg directly on the <input> like
 *
 * <input myErrorMsg='theNameOfTheField'>
 *
 * And OPTIONNALY define in HTML another component where the validation error messages would go
 * <my-error-msg #theNameOfTheField="myErrorMsg" ></my-error-msg>
 * #refVar="myErrorMsg" creates a template-var-reference to the <my-error-msg> component.
 * And then this ref is given to the directive myErrorMsg with [myErrorMsg]="refVar"
 *
 * If the component  <my-error-msg> is not created, the directive myErrorMsg will create it automatically
 * under the <input>
 *
 * => The directive myErrorMsg will listen to the blur event and transform it
 * into a valueChanges event so show the validation errors even when using OnPush.
 *
 * Note:
 *  the formControl SHOULD NOT change overtime, since it is RESOLVED at OnInit()
 *  Hereafter the control will NOT evolve if you change your form.
 *  for example it won't work if you rebuild new formControls with the FormBuilder.
 */
@Component({
  selector: 'my-error-msg',
  template: `
    {{onRefreshCounter()}}
    <ng-container *ngIf="errors && (this.control.dirty || this.control.touched)">
      <div [ngClass]="customClassObject" class="my-error-GLOBAL">
        <label *ngFor="let message of mymsgs">{{message}}</label>
      </div>
    </ng-container>
  `,
  exportAs: 'myErrorMsg',
  styles: [
    `
        label {
            color: red;
            display: block;
            margin-bottom: 0;
        }

        /* Define CSS with my-error-GLOBAL in the GLOBAL file ./src/styles.css */
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyErrorMessageComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() myErrorExtraMsg: ErrorMsgMap = {};
  control!: AbstractControl;
  errors = false;
  subscription!: Subscription;
  customClassObject: any;
  mymsgs: string[] = [];
  id = ''; // id of corresponding <input id=xx> if defined
  counter: number = 1;
  // adebounce: number = 0; // debouncing is NOT very interesting, because there is still a full changeDetection cycle
  // it is just that the error are not shown, but there is no gain of perf (because there IS a CD).
  // MUCH better option to prevent multiple CDs, you need to change the ControlValueAccessor for the input and add a debounce
  // when the incoming DOM value changes. Quite simple, and can be made independant of the validators

  constructor(private cd: ChangeDetectorRef) {
    Plog.validationErrorMsgCreation('<pee-error-msg>');
  }

  @Input() set myErrorClass(className: string) {
    // this.host.nativeElement.classList.add(className);
    this.customClassObject = {[`${className}`]: true};
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * With ngMaterial INPUT, the blur does NOT generate a valueChanges ...
   * So for example an error computed at startup is not shown because dirty==false, touched==false at that time.
   * ok so far.
   * This error Will NOT be shown when touched turns true, because I need an explicit  this.cd.markForCheck();
   * for this OnPush MyErrorMessageComponent.
   * 4 Options:
   *    -1 inspect control.touched on each CD with DoCheck,
   *      and kick off a compute and markForCheck when turning true
   *    -2 OR NOT be OnPush, and let the HTML refresh with a *ngIf on the touched/dirty flag
   *    We can pre-compute the errors-msgs before so we don't have to do it again.
   *    This works only if the <my-error-msg> is not in OnPush wrapping component around ...
   *    -3 OR use a specific CVA, which generates always a valueChanges ALSO when a blur is made.
   *    So if a CVA like taht is added on each onput it will work.
   *    ErrorMessageComponent could OnPush and refresh only on valueChanges() + cd.markForCheck()
   *    -4 OR NEW SOLUTION : *** probably the BEST *** and this is the Strategy used in this toolkit.
   *    Make the use of myErrorMsg DIRECTIVE (which follow solution 3 above) required to have validation errors.
   *    Then myErrorMsg will add a blur listener to emit a valueChanges event when thers is a blur.
   *    The myErrorMsg directive will CONNECT to this component MyErrorMessageComponent or create it dynamically.
   *    This solution is described in the comment above this class
   */


  ngOnInit(): void {
    // this.compute(); // for startup, so that this.msgs is filled
    // this.subscription = this.control.valueChanges.subscribe(() => {
    //   this.compute();
    //   this.cd.markForCheck();
    // });
  }

  ngAfterViewInit(): void {
    this.compute(); // for startup, so that this.msgs is filled
    this.subscription = this.control.valueChanges
      .subscribe(() => {
        this.compute();
        this.cd.markForCheck();
      });
  }

  compute() {
    this.mymsgs = [];
    if (this.control && this.control.errors) {
      Object.keys(this.control.errors)
        .forEach(key => {
          // for each key, check if there is a custom messages override
          const c: string | ErrorMsgFn = this.myErrorExtraMsg[key];
          if (c) {
            if (typeof c === 'string') {
              this.mymsgs.push(c);
            } else {
              this.mymsgs.push(c(this.control.errors![key]));
            }
          } else {
            this.mymsgs.push(this.control.errors![key].msg);
          }
        });
    }

    if (this.mymsgs.length > 0) {
      this.errors = true;
    } else {
      this.errors = false;
    }
    const msg = this.id ? `${this.id}.valueChanges() extracting` : 'c.valueChanges() extracting';
    Plog.validationCompute(msg, this.errors ? this.mymsgs : 'no-errors');
  }

  onRefreshCounter() {
    Plog.validationErrorMsgRefresh(`MY-ERROR-MSG ${this.id} ${this.counter++}`);
  }

}

