/* eslint-disable no-underscore-dangle*/
import {ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {fromEvent, merge, Observable, Subscription, timer} from 'rxjs';
import {debounce, map} from 'rxjs/operators';

//  {  'blur': 0, 'input': 300 } }
export interface ControlOptions {
  blur?: number;
  input?: number;
}

/**
 * This is the default values
 * You can customize ie :
 * [myControlOptions]="{  'blur': 0, 'input': 300}" means you want a valueChanges emit on blur with a debounce of 0,
 * and a valueChanges emit on input with a debounce of 300.
 */
const DEFAULT_CONTROL_OPTIONS: ControlOptions = {
  blur: 0,
  input: 300,
};

/**
 *  myControlOptions directive SHOULD NO BE USED on input type=radio
 *  myControlOptions directive SHOULD NO BE USED on input type=checkbox
 *  myControlOptions cold be used on text, email and number types
 *
 *  Use:
 *
 *  peeCOntrolOptions
 *  With no param : you get the default  blur =0 , input 300ms of debounce
 *
 * <input  myControlOptions formControlName="titre"  placeholder="Titre">
 *
 * or with more fine grain control
 *
 *  Now blur has 0 debounce, input has 3000 ms =>
 * <input  [myControlOptions]="{blur: 0, input: 3000}" formControlName="titre"  placeholder="Titre">
 */
@Directive({
  selector:
  // types selector number + email + text + default(=text)
    '[myControlOptions][formControlName],' +
    '[myControlOptions][formControl],' +
    '[myControlOptions][formControl]input[type=text],' +
    '[myControlOptions][formControlName]input[type=text],' +
    '[myControlOptions][formControl]input[type=number],' +
    '[myControlOptions][formControlName]input[type=number],' +
    '[myControlOptions][formControl]input[type=email],' +
    '[myControlOptions][formControlName]input[type=email]'
  ,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyControlOptionsDirective),
    multi: true,
  }],
})
export class MyControlOptionsDirective implements ControlValueAccessor, OnInit, OnDestroy {
  events!: Subscription;
  onChange: any;
  onTouched: any;
  _controlOptions: ControlOptions = DEFAULT_CONTROL_OPTIONS;

  constructor(private renderer: Renderer2,
              private element: ElementRef,
              private cd: ChangeDetectorRef) {
    Plog.createDirective('MyControlOptionsDirective');
  }

  @Input()
  get myControlOptions(): ControlOptions {
    return this._controlOptions;
  }

  set myControlOptions(val: ControlOptions | '') {
    if (val) {
      this._controlOptions = val;
    }
  }

  ngOnInit() {
    Plog.violet('CONTROL_OPTIONS', this._controlOptions);
    const event$Array: Observable<Event>[] = Object.keys(this._controlOptions)
      .map(k => fromEvent(this.element.nativeElement, k));

    console.log('EVENTS', event$Array);

    this.events = merge(...event$Array)
      .pipe(
        map((e: Event) => ({type: e.type, value: (e.target as HTMLInputElement).value})),
        debounce(event => {
          // {'blur': 0, 'input': 300}
          let time = 0;
          const type = event.type;
          if (type === 'blur' || type === 'input') {
            const t = this._controlOptions[type];
            time = t ? t : 0;
          }
          return timer(time);
        }),
        map(event => {
          if (event.type === 'blur') {
            this.onTouched(event.value);
            this.onChange(event.value); // the changed is required to recompute validators
            // because otherwise, a strange bug:  for example if validator minlength=3 and required
            // type 2 caracters abd click outside to blur before the debounce time
            // => then the field stays pristine, (touched is ok)
            // ANd the validators are NOT recomputed by Angular.
          } else if (event.type === 'input') {
            this.onChange(event.value);
          }
          return event;
        }),
      )
      // distinctUntilChanged is dangerous, the previous events
      // may have been unsuccessful for other reasons
      // .distinctUntilChanged()
      .subscribe(event => {
        Plog.validator('SPARKing a change', event, event.value);
        // this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    if (this.events) {
      this.events.unsubscribe();
    }
  }

  /**
   * implements ControlValueAccessor API
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * implements ControlValueAccessor API
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * implements ControlValueAccessor API
   */
  writeValue(value: any): void {
    const normalizedValue = value == null ? '' : value;
    this.renderer.setProperty(this.element.nativeElement, 'value', normalizedValue);
  }

  /**
   * implements ControlValueAccessor API
   */
  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled);
  }

}
