import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MY_ALERT_SERVICE_API, MY_MESSAGES_SERVICE_API, MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {CvaComboComponent} from './reactive-all/cva-combo.component';
import {ReactiveAllComponent} from './reactive-all/reactive-all.component';
import {AlertWithSimpleLogService} from './validators/alert-with-simple-log.service';
import {TypicalMessagesService} from './validators/typical-messages.service';
import {TypicalStandaloneValidatorsService} from './validators/typical-standalone-validators.service';
import {TypicalValidatorsService} from './validators/typical-validators.service';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveAllComponent,
    CvaComboComponent,
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
    TypicalMessagesService,
    TypicalValidatorsService,
    TypicalStandaloneValidatorsService,
    AlertWithSimpleLogService,
    // Providing MY_ALERT_SERVICE_API is useful only for the submit directive feature (mySubmitIfValidAndDirty)="onSend()"
    // to show popup
    {
      provide: MY_ALERT_SERVICE_API,
      useClass: AlertWithSimpleLogService
    },
    // providing MY_MESSAGES_SERVICE_API enables the (mySubmitIfValidAndDirty) Directive
    // to pop alert with message label you define in your MessageService (here I18nMessagesService)
    // when makin the form dirty for example
    {
      provide: MY_MESSAGES_SERVICE_API,
      useClass: TypicalMessagesService,
    },
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

