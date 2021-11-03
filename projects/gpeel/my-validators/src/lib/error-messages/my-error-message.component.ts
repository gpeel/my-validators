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

/* tslint:disable:component-selector */
/**
 * Use:
 * I removed the SIMPLISTIC use which was not advisable, because it did not refresh for 'blur' events when using OnPush.
 * <my-error-msg [control]="form.get('prenom')"></my-error-msg>
 *
 * It is now REQUIRED to use the directve myErrorMsg directly on the <input> like
 *
 * <input myErrorMsg='theNameOfTheField'>
 *
 * And OPTIONNALY define in HTML where the validation error messages would go
 * <my-error-msg #theNameOfTheField="myErrorMsg" ></my-error-msg>
 *
 * => With that strategy a blur will always show the validation errors even when using OnPush.
 * And then you place where you want the location of the errors on the UI with:
 *  <my-error-msg #theNameOfTheField="myErrorMsg" ></my-error-msg>
 * If you don't write the <my-error-msg> explicitly, the component is dynamically created
 * under the <input>.
 *
 * #refVar="myErrorMsg" creates a template-var-reference to the <my-error-msg> component.
 * And then this ref is given to the directive myErrorMsg with [myErrorMsg]="refVar"
 *
 * Note:
 *  the formControl SHOULD NOT change overtime, since it is RESOLVED at OnInit()
 *  Hereafter the control will NOT evolve if you change your form.
 *  for example it won't work if you rebuild new formCOntrols with the FormBuilder.
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
   * So an error computed at startup but not shown because dirty==false, touched==false at that time.
   * Will NOT be shown when touched turns true, because I need an explicit  this.cd.markForCheck();
   * for that.
   * 4 Options:
   *    -1 inspect control.touched on each CD with DoCheck,
   *      and kick off a compute and markForCheck when turning true
   *    -2 OR NOT be OnPush, and let the HTML refresh with a *ngIf on the touched/dirty flag
   *    We can pre-compute the errors-msgs before so we don't have to do it again.
   *    This works only if the <my-error-msg> is not in OnPush component ...
   *    -3 OR use a specific CVA like peeControlOptions, which generates always a valueChanges ALSO when a blur is made.
   *    So if peeControlOptions CVA is added on each onput it will work.
   *    ErrorMessageComponent could OnPush and refresh only on valueChanges() + cd.markForCheck()
   *    -4 OR NEW SOLUTION : *** probably the BEST *** and this is ths Strategy used in this toolkit.
   *    always use the myErrorMsg DIRECTIVE (same tek solution as peeCOntrolOptions as in the CVA solution 3)
   *    which then could add a blur listener to emit
   *    a valueChanges event. and CONNECT to this component
   *    <my-error-msg>. This solution is described in the comment above this class
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
    this.subscription = this.control.valueChanges.subscribe(() => {
      this.compute();
      this.cd.markForCheck();
    });
  }

  compute() {
    this.mymsgs = [];
    if (this.control && this.control.errors) {
      Object.keys(this.control.errors)
        .forEach(key => {
          // for each key, check if there is a custom message override
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

