import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {makeDirty, MyValidators} from '@gpeel/my-validators';
import {Plog} from '@gpeel/plog';

@Component({
  selector: 'reactive-ui',
  templateUrl: 'reactive-ui.component.html',
  styleUrls: ['reactive-ui.component.css']
})
export class ReactiveUiComponent implements OnInit {

  originalInstance = {
    name1: 'Thomas1',
    name2: 'Thomas2',
    name3: '',
    name4: 'Thomas4',
    name5: 'Thomas5',
    name6: 'Thomas6',
  };
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    const validators = [Validators.required, MyValidators.minLength(3), MyValidators.pattern(/titi/), this.myCustomValidatorForbiddenName];

    this.form = this.fb.group({
      name1: [this.originalInstance.name1, validators],
      name2: [this.originalInstance.name2, validators],
      name3: [this.originalInstance.name3, validators],
      name4: [this.originalInstance.name4, validators],
      name5: [this.originalInstance.name5, validators],
      name6: [this.originalInstance.name6, validators],
    });

    // For DEBUG and demo purpose, some logs to get NG feedbacks:
    this.form.valueChanges.subscribe(d => Plog.colorGreen('form.valueChanges', d));
    this.form.statusChanges.subscribe(d => Plog.colorGreen('form.statusChanges', d));
    this.form.get('name1')!.valueChanges.subscribe(d => Plog.colorGreen('name1.valueChanges', d));
    this.form.get('name1')!.statusChanges.subscribe(d => Plog.colorGreen('name1.statusChanges', d));

  }

  /**
   * will react to an enter on any input, because it is the first <button> of type submit
   */
  onSend() {
    console.log('in onSend: form ', this.form);
    console.log('form.value ', this.form.value);
  }

  onCancel() {
    this.form.reset({name: this.originalInstance});
  }

  onSubmit() {
    console.log('in onSubmit: form ', this.form);
    console.log('form.value ', this.form.value);
  }

  onFillaCorrectForm() {
    const correctinstance = {
      name1: 'Aristotetiti1',
      name2: 'Aristotetiti2',
      name3: 'Aristotetiti3',
      name4: 'Aristotetiti4',
      name5: 'Aristotetiti5',
      name6: 'Aristotetiti6',
    };
    this.form.setValue(correctinstance); // setValues does NOT turn the form into dirty;
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
