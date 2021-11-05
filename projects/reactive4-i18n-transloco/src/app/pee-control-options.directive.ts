/* eslint-disable no-underscore-dangle*/
import {ChangeDetectorRef, Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Plog} from '@gpeel/plog';
import {fromEvent, merge, Observable, Subscription, timer} from 'rxjs';
import {debounce, map} from 'rxjs/operators';

// { updateOn: 'blur input', debounce: {  'blur': 0, 'input': 300 } }
export interface ControlOptions {
  updateOn: string;
  debounce: {
    [key: string]: number;
  };

}


/**
 * This is the default values
 * You can customize ie :
 * [peeControlOptions]="{ updateOn: 'blur input', debounce: {  'blur': 0, 'input': 300 } }"
 *
 *  debounce: {'input': 200}, => if blur not present => debounce time defaulting to 0
 */
const DEFAULT_CONTROL_OPTIONS: ControlOptions = {
  updateOn: 'blur input',
  debounce: {blur: 0, input: 3000},
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
  // syntax example for complex selecctor, from angular ngForm
  // selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,[ngForm]',
  // 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
    '[peeControlOptions][formControlName],[peeControlOptions][formControl],[peeControlOptions][ngModel]',
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
  get peeControlOptions() {
    return this._controlOptions;
  }

  set peeControlOptions(val) {
    if (val) {
      this._controlOptions = {...this._controlOptions, ...val};
    }
  }

  ngOnInit() {
    const events: Observable<any>[] = this._controlOptions.updateOn.split(' ')
      .map(event => fromEvent(this.element.nativeElement, event));

    this.events = merge(...events)
      .pipe(
        // @ts-ignore
        map((e: Event) => ({type: e.type, value: e.target.value})),
        debounce(event => {
          const debounceValue = this._controlOptions.debounce; // {'blur': 0, 'input': 300}
          let time = 0;
          // if (typeof debounceValue === 'number') {
          //   time = debounceValue;
          // } else if (typeof debounceValue === 'object') {
          const t = event.type;
          time = debounceValue[t] ? debounceValue[t] : 0;
          // }
          return timer(time);
        }),
        map(event => {
          if (event.type === 'blur') {
            // Plog.pink('BLUR => touched');
            this.onTouched(event.value);
            this.onChange(event.value); // the changed is required
            // because otherwise, a strange bug:  for exmaple if validator minlength=3 and required
            // type 2 caracters abd clic outside to blur before the debounce time
            // => then the field stays pristine, (touched is ok)
            // ANd the validators are NOT recomputed by Angular.
            // So ther erro show is 'Field is required' but it should be 'length should eb longer than 3'
          } else if (event.type === 'input') {
            this.onTouched(event.value);
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
