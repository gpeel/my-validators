/* eslint-disable no-underscore-dangle*/
import {ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {fromEvent, merge, Observable, Subscription, timer} from 'rxjs';
import {debounce, map} from 'rxjs/operators';

//  {  'blur': 0, 'input': 300 } }
export interface ControlOptions {
  blur: number;
  input: number;
}

export interface ControlOptionals {
  blur?: number;
  input?: number;
}


/**
 * This is the default values
 * You can customize ie :
 * [peeControlOptions]="{  'blur': 0, 'input': 300}" means you want a valueChanges emit on blur with a debounce of 0,
 * and a valueChanges emit on input with a debounce of 300.
 */
const DEFAULT_CONTROL_OPTIONS: ControlOptions = {
  blur: 0,
  input: 3000,
};

/**
 *  peeControlOptions directive SHOULD NO BE USED on input type=radio
 *  peeControlOptions directive SHOULD NO BE USED on input type=checkbox
 *  Use:
 *
 *  peeCOntrolOptions
 *  With no param : blur =0 , input 300ms of debounce
 *
 * <input  peeControlOptions formControlName="titre"  placeholder="Titre">
 *
 * or with more fine grain control
 *
 *  blur and input have a 200ms debounce =>
 *  <input  [peeControlOptions]="200" formControlName="titre"  placeholder="Titre">
 *
 *  Now blur has 0 debounce, input has 3000 ms =>
 * <input  [peeControlOptions]="{blur: 0, input: 3000}" formControlName="titre"  placeholder="Titre">
 */
@Directive({
  selector:
  // types number + email cold be added
    '[peeControlOptions][formControlName],' +
    '[peeControlOptions][formControl],' +
    '[peeControlOptions][ngModel]input[type=text]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PeeControlOptionsDirective),
    multi: true,
  }],
})
export class PeeControlOptionsDirective implements ControlValueAccessor, OnInit, OnDestroy {
  events!: Subscription;
  onChange: any;
  onTouched: any;
  _controlOptions: ControlOptions = DEFAULT_CONTROL_OPTIONS;


  constructor(private renderer: Renderer2,
              private element: ElementRef,
              private cd: ChangeDetectorRef) {
    Plog.createDirective('PeeControlOptionsDirective');
  }

  @Input()
  get peeControlOptions(): ControlOptionals {
    return this._controlOptions;
  }

  set peeControlOptions(val: ControlOptionals | '') {
    if (val) {
      this._controlOptions = {...this._controlOptions, ...val};
    }
  }

  ngOnInit() {
    const events$: Observable<any> = merge(
      fromEvent(this.element.nativeElement, 'blur'),
      fromEvent(this.element.nativeElement, 'input'));

    this.events = events$
      .pipe(
        map((e: Event) => ({type: e.type, value: (e.target as HTMLInputElement).value})),
        debounce(event => {
          // {'blur': 0, 'input': 300}
          let time = 0;
          const t = event.type;
          if (t === 'blur' || t === 'input') {
            time = this._controlOptions[t] ? this._controlOptions[t] : 0;
          }
          return timer(time);
        }),
        map(event => {
          if (event.type === 'blur') {
            this.onTouched(event.value);
            this.onChange(event.value); // the changed is required to recompute validators
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
        this.cd.markForCheck();
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
