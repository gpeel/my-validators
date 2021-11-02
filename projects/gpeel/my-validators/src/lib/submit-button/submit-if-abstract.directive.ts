import {Directive, HostListener, InjectFlags, Injector} from '@angular/core';
import {AbstractControl, FormArray, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {Plog} from '@gpeel/plog';

/**
 * This function could be useful, outside of this @Directive
 */
export function makeDirty(fg: FormGroup | FormArray | NgForm): void {
  Plog.errorMsg('Turning every pristine field to dirty in the Form to reveal validation errors');
  Object.keys(fg.controls)
    .forEach((fieldName: string) => {
      // @ts-ignore
      const ac: AbstractControl = fg.controls[fieldName];
      ac.markAsDirty();
      ac.markAsTouched(); // necessary for LABEL when using material
      ac.updateValueAndValidity(); // necessary to provoke a valueChanges()
      // => so the validators are recomputed => so the widget <pee-error-msg> is refreshed
      if ((ac instanceof FormGroup) || (ac instanceof FormArray)) {
        makeDirty(ac);
      }
    });
}

@Directive()
export abstract class SubmitIfAbstractDirective {

  /**
   * Only tested for REACTIVE FORMS API yet
   * Still to be tested : FormArray
   * Also should be tested on TEMPLATE API
   * BUT should work in both cases
   */
  protected constructor(private injector: Injector) {
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    // resolve the current form
    const form = this.resolveForm(this.injector);
    this.executeBehavior(form);
  }

  /**
   * THIS is THE BEHAVIOR
   * should be implemented by subclass
   */
  protected abstract executeBehavior(form: FormGroup): void;

  /**
   * Looking form the Root FormGroup SHOULD NOT be done at init
   * because in some circustance the form could be rebuilt !
   */
  // ngOnInit(): void {
  //   this.form = this.resolveForm(this.injector);
  // }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  protected makeDirty(fg: FormGroup | FormArray) {
    makeDirty(fg);
  }

  /**
   *  we should be sure to go up to the top formGroup which represents the <form> tag
   *  The first FormGroup found is potentially NOT the top
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private resolveForm(injector: Injector): FormGroup {
    const formGroupDirective = injector.get(FormGroupDirective, null, InjectFlags.Optional);
    const ngForm = injector.get(NgForm, null, InjectFlags.Optional);
    let form: FormGroup | undefined;

    if (formGroupDirective) {
      let fg: FormGroup | FormArray = formGroupDirective.control;
      while (fg.parent) {
        fg = fg.parent;
      }
      form = fg as FormGroup;
    }
    // TEMPLATE API
    if (ngForm) {
      form = ngForm.control;
    }
    if (!form) {
      throw new Error('FormGroup not found, because no Provider, check your code !');
    }
    return form;
  }
}


