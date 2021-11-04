import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors} from '@angular/forms';
import {ErrorMsgMap, makeDirty, MyValidators} from '@gpeel/my-validators';
import {Plog} from '@gpeel/plog';
import {InterfaceStyleEnum, SubscriptionOptions, UserData} from './user-data';

@Component({
  selector: 'reactive-all',
  templateUrl: 'reactive-all.component.html',
  styleUrls: ['reactive-all.component.css']
})
export class ReactiveAllComponent implements OnInit {

  subscriptionsTypeOptions: SubscriptionOptions[] = ['Lifetime', 'Annual', 'Monthly'];
  originalUserData: UserData = {
    id: 5,
    name: 'Tom',
    emailOffers: true,
    interfaceStyle: undefined,
    subscriptionType: undefined,
    subscriptionTypeComboCva: undefined,
    notes: undefined,
    uneditedField: 'whatwhat'
  };

  extraMessagesOverride: ErrorMsgMap = {
    required: 'Override You must choose something !',
    minlength: ({
                  actualLength,
                  requiredLength
                }) => `Override : Actual length is ${actualLength} and we need ${requiredLength}!`
  };

  form!: FormGroup; // ! is used to get rid of STRICT null check for that variable, it is better than // @ts-ignore
  InterfaceStyleEnum = InterfaceStyleEnum;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    // extracting a bean of ONLY the edited fields
    const {uneditedField, id, ...allotherFields} = this.originalUserData;

    // allotherField is of type : Omit<UserData, 'uneditedField | 'id'>
    this.form = this.fb.group(allotherFields);
    console.log(allotherFields, this.form);

    // Using MyValidators instead of Angular Validators (Same API)
    // but MyValidators are adding the {msg : 'errorMessage'} to the return
    this.form.get('name')!.setValidators([
      MyValidators.required,
      MyValidators.minLength(3),
      MyValidators.pattern(/titi/),
      this.myCustomValidatorForbiddenName]);
    //
    this.form.get('interfaceStyle')!.setValidators([MyValidators.required, MyValidators.minLength(3)]);
    this.form.get('emailOffers')!.setValidators([MyValidators.requiredTrue]);
    this.form.get('subscriptionType')!.setValidators([MyValidators.required]);
    this.form.get('subscriptionTypeComboCva')!.setValidators([MyValidators.required]);
    this.form.get('notes')!.setValidators([MyValidators.required]);

    // For DEBUG and demo purpose, some logs to NG feedbacks:
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
    // Recomposing the data object
    // Strategy ES5
    // const result = Object.assign({}, this.originalUserData, this.form.value);
    // Strategy ES6, using spread ...
    const modifiedInstance = {...this.originalUserData, ...this.form.value};
    console.log('Recomposed full DTO to call the Backend', modifiedInstance);
  }

  onCancel() {
    const {uneditedField, id, ...allotherFields} = this.originalUserData;
    this.form.reset(allotherFields);
  }

  onSubmit() {
    console.log('in onSubmit: form ', this.form);
    console.log('form.value ', this.form.value);
  }

  onFillaCorrectForm() {
    const fillingValues: Omit<UserData, 'uneditedField' | 'id'> = {
      name: 'Aristotetiti',
      emailOffers: true,
      interfaceStyle: InterfaceStyleEnum.Medium,
      subscriptionType: 'Annual',
      subscriptionTypeComboCva: 'Lifetime',
      notes: ' a minimum of comments',
    };
    // this.form.setValue(fillingValues); // setValues does NOT turn the form into dirty;
    this.form.patchValue(fillingValues); // setValues does NOT turn the form into dirty;
    // you must change the flas by yourself.
    // This in normal behavior, only user actions on the browser changes the flags
    this.form.markAsDirty({onlySelf: false}); // NOT enough => use the custom method makeDirty
    makeDirty(this.form);
  }

  myCustomValidatorForbiddenName(control: AbstractControl): ValidationErrors | null {
    if (control.value?.includes('toto')) {
      console.log('TOTO!!!!!!!!!!!!!!!!!!!!!!!!');
      // FULL hard coded message here (see better solution in other folders)
      return {myCustomValidator: {msg: 'Toto is forbidden'}};
    }
    return null;
  }
}
