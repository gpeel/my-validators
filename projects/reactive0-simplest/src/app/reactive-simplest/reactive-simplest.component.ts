import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {makeDirty, MyValidators} from '@gpeel/my-validators';
import {Plog} from '@gpeel/plog';

@Component({
  selector: 'user-reactive-form-1',
  templateUrl: 'reactive-simplest.component.html',
  styleUrls: ['reactive-simplest.component.css']
})
export class ReactiveSimplestComponent implements OnInit {

  originalName: string = 'Thomas';
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {

    // ANGULAR standard Validators
    // import {Validators} from '@angular/forms';
    // Strategy Standard to build a Group With Angular Validators
    // this.form = this.fb.group({
    //   name: [this.originalName,
    //     [Validators.required, Validators.minLength(3), Validators.pattern(/titi/), this.myCustomValidatorForbiddenName]],
    // });

    // Using MyValidators instead of Angular Validators (Same API)
    // import {MyValidators} from '@gpeel/my-validators';
    this.form = this.fb.group({
      name: [this.originalName,
        [MyValidators.required,
          MyValidators.minLength(3),
          MyValidators.pattern(/titi/),
          this.myCustomValidatorForbiddenName]
      ],
    });

    // For DEBUG and demo purpose, some logs to get NG feedbacks:
    this.form.valueChanges.subscribe(d => Plog.colorGreen('form.valueChanges', d));
    this.form.statusChanges.subscribe(d => Plog.colorGreen('form.statusChanges', d));
    this.form.get('name')!.valueChanges.subscribe(d => Plog.colorGreen('name.valueChanges', d));
    this.form.get('name')!.statusChanges.subscribe(d => Plog.colorGreen('name.statusChanges', d));

  }

  /**
   * will react to an enter on any input, because it is the first <button> of type submit
   */
  onSend() {
    console.log('in onSend: form ', this.form);
    console.log('form.value ', this.form.value);
  }

  onCancel() {
    this.form.reset({name: this.originalName});
  }

  onSubmit() {
    console.log('in onSubmit: form ', this.form);
    console.log('form.value ', this.form.value);
  }

  onFillaCorrectForm() {
    this.form.setValue({name: 'Aristotetiti'}); // setValues does NOT turn the form into dirty;
    this.form.markAsDirty({onlySelf: false}); // markAsDirty still does NOT => use the custom method makeDirty
    makeDirty(this.form);
  }

  myCustomValidatorForbiddenName(control: AbstractControl): ValidationErrors | null {
    if (control.value?.includes('toto')) {
      // FULL hard coded messages for validation error here (see better solution in other example projects)
      const error = {myCustomValidator: {msg: 'Toto is forbidden'}};
      Plog.validator('myCustomValidatorForbiddenName invoked', error);
      return error;
    }
    return null;
  }
}
