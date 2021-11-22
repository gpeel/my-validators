import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {ReactiveUiComponent} from './reactive-flexible-ui/reactive-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveUiComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    //
    MyValidatorsModule,
    PlogModule.forRoot(environment),
    NgbModule,
  ],
  providers: [
    // MY_SHOW_ERROR_MSG_FUNCTION_API enable to change to function used by <my-error-msg> component to show the errors
    // You can change globally this function here,
    // or you can make a local change for one specific input with the use showErrorFunction @Input
    // on <my-error-msg [showErrorFunction]="fn" > or on <input myErrorMsg  [showErrorFunction]="fn" >
    // {
    //   provide: MY_SHOW_ERROR_MSG_FUNCTION_API,
    //   // default value:
    //   // useValue: (control: AbstractControl) => (control.dirty || control.touched)
    //   // not showing error until blurred
    //   useValue: (control: AbstractControl) => control.touched
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

