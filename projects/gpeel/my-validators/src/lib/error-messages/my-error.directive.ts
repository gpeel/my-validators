import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewContainerRef
} from '@angular/core';
import {ControlContainer, NgControl} from '@angular/forms';
import {fromEvent} from 'rxjs';
import {ErrorMsgMap} from '../error-messages/error-msg-api';
import {MyErrorMessageComponent} from './my-error-message.component';


/**
 * Use :
 *   <input myErrorMsg='theNameOfTheTemplateVarRef'>
 *
 * And where you want the error comp to appear
 *  <my-error-msg #theNameOfTheTemplateVarRef="myErrorMsg" ></my-error-msg>
 *
 * Option : the silent option :
 * If you don't code the above the component <my-error-msg ...></my-error-msg>
 * is created implicitly just under the <input> (it is for basic cases)
 *
 *  the FormControl (NgControl) SHOULD NOT change overtime,
 *  since it is RESOLVED at OnInit().
 *  Hereafter the control will NOT evolve if you change your form.
 *  for example it won't work if you rebuild it with the FormBuilder.
 */
@Directive({
  selector: '[myErrorMsg]'
})
export class MyErrorDirective implements OnInit, AfterViewInit, OnChanges {
  // undefined for [myErrorMsg]
  @Input('myErrorMsg') component: MyErrorMessageComponent | undefined | '';

  // when using this directive without params the value set by Angular will be
  // '' for myErrorMsg
  @Input() myErrorClass: string | undefined;
  @Input() myErrorExtraMsg: ErrorMsgMap | undefined;
  @Input() id: string = '';

  constructor(private vcr: ViewContainerRef,
              private resolver: ComponentFactoryResolver,
              @Optional() @Self() private ngControlSelf: NgControl,
              @Optional() @Self() private controlContainerSelf: ControlContainer,
              private host: ElementRef) {
  }

  // component: MyErrorMessageComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.myErrorExtraMsg) {
      if (this.component && this.myErrorExtraMsg) {
        this.component.myErrorExtraMsg = this.myErrorExtraMsg;
      }
    }
    if (changes.myErrorClass) {
      if (this.component && this.myErrorClass) {
        this.component.myErrorClass = this.myErrorClass;
      }
    }
  }

  ngOnInit(): void {
    const self = this.controlContainerSelf || this.ngControlSelf;

    if (!this.component) {
      // if the <my-error-msg ...></my-error-msg> is referenced, just use it
      // otherwise create it !
      const factory = this.resolver.resolveComponentFactory(MyErrorMessageComponent);
      this.component = this.vcr.createComponent(factory).instance;
    }

    if (self.control) {
      this.component.control = self.control;
    }

    if (this.myErrorClass) {
      this.component.myErrorClass = this.myErrorClass;
    }
    if (this.myErrorExtraMsg) {
      this.component.myErrorExtraMsg = this.myErrorExtraMsg;
    }
    if (this.id) {
      this.component.id = this.id;
    }

    // correcting the blur event defective-NG-strategy
    fromEvent(this.host.nativeElement, 'focusout') // focusout same as blur
      .subscribe((e) => {
        if (this.component) {
          this.component.control.updateValueAndValidity();
        }
        // this.component.control.markAsTouched(); // not necessary ...
      });
  }

  ngAfterViewInit(): void {
    if (!this.id) {
      if (this.host.nativeElement.id) {
        this.id = this.host.nativeElement.id;
        if (this.component) {
          this.component.id = this.id;
        }
      }
    }
  }


}


