import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ErrorMsgMap, makeDirty} from '@gpeel/my-validators';
import {InterfaceStyleEnum, UserData} from './user-data';

type UserFormDto = Omit<UserData, 'id' | 'uneditedField'>;

@Component({
  selector: 'user-template-form',
  templateUrl: './user-form-template.component.html',
  styleUrls: ['./user-form-template..component.css']
})
export class UserFormTemplateComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('form') ngForm!: NgForm;

  originalUser: UserData = {
    id: 5,
    name: 'Tom',
    emailOffers: true,
    interfaceStyle: undefined,
    subscriptionType: undefined,
    notes: undefined,
    uneditedField: 'whatwhat'
  };


  editedUser!: UserFormDto;

  extraMessages: ErrorMsgMap = {
    required: 'You must choose something !',
    minlength: ({actualLength, requiredLength}) => `ACTUAL length is ${actualLength} and we need ${requiredLength}!`
  };
  InterfaceStyleEnum = InterfaceStyleEnum;

  ngOnInit() {
    // extracting a bean of ONLY the edited fields
    const {uneditedField, id, ...allotherFields} = this.originalUser;
    this.editedUser = allotherFields;
  }

  ngAfterViewInit(): void {
    this.ngForm.valueChanges!.subscribe(d => console.log('form.valueChanges', d));
    this.ngForm.statusChanges!.subscribe(d => console.log('form.statusChanges', d));
    // this.ngForm.controls.name not YET available ... Template API is curious
    // this.ngForm.controls.name.valueChanges.subscribe(d => console.log('name.valueChanges', d));
    // this.ngForm.controls.name.statusChanges.subscribe(d => console.log('name.statusChanges', d));
  }

  /**
   * will react to an enter on any input, because it is the first <button> of type submit
   */
  onSend() {
    console.log('in onSend: form ', this.ngForm);
    // Recomposing the data object
    // Strategy ES5
    // const result = Object.assign({}, this.originalUserData, this.form.value);
    // Strategy ES6, using spread ...
    const modifiedInstance = {...this.originalUser, ...this.editedUser};
    console.log('Recomposed full DTO to call the Backend', modifiedInstance);
  }

  onCancel() {
    const {uneditedField, id, ...allotherFields} = this.originalUser;
    this.ngForm.reset(allotherFields);
  }

  onSubmit() {
    console.log('in onSubmit: form ', this.ngForm);
    console.log('form.value ', this.ngForm.value);
  }

  onFillaCorrectForm() {
    const fillingValues: Omit<UserData, 'uneditedField' | 'id'> = {
      name: 'Aristote',
      emailOffers: true,
      interfaceStyle: InterfaceStyleEnum.Medium,
      subscriptionType: 'Annual',
      notes: ' a minimum of comments',
    };
    // this.form.setValue(fillingValues); // setValues does NOT turn the form into dirty;
    this.ngForm.setValue(fillingValues); // setValues does NOT turn the form into dirty;
    // you must change the flag by yourself.
    // This in normal behavior, only user actions on the browser changes the flags
    makeDirty(this.ngForm);
  }


}
