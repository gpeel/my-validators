import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {DebugFormComponent} from './debug-form/debug-form.component';
import {DebugInputFieldComponent} from './debug-form/debug-input-field.component';
import {MyControlOptionsDirective} from './error-messages/my-control-options.directive';
import {MyErrorMessageComponent} from './error-messages/my-error-message.component';
import {MyErrorDirective} from './error-messages/my-error.directive';
import {MY_ALERT_SERVICE_API} from './pluggable-api/alert/alert-api';
import {DefaultAlertService} from './pluggable-api/alert/default-alert.service';
import {DefaultMessagesService} from './pluggable-api/messages/default-messages.service';
import {
  DEFAULT_SHOW_ERROR_MSG_FUNCTION,
  MY_MESSAGES_SERVICE_API,
  MY_SHOW_ERROR_MSG_FUNCTION_API,
  ShowFunction
} from './pluggable-api/messages/messages-service-api';
import {DefaultValidatorsService} from './pluggable-api/validators/default-validators.service';
import {MY_VALIDATORS_SERVICE_API} from './pluggable-api/validators/validators-service-api';
import {MySubmitIfValidAndDirtyDirective} from './submit-button/my-submit-if-valid-and-dirty.directive';
import {MySubmitIfValidDirective} from './submit-button/my-submit-if-valid.directive';
import {
  MyCheckboxRequiredValidator,
  MyEmailValidator,
  MyMaxLengthValidator,
  MyMinLengthValidator,
  MyPatternValidator,
  MyRequiredValidator
} from './validators/solution-1-simplest/my-validators-directive';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DebugFormComponent,
    DebugInputFieldComponent,
    MyErrorMessageComponent,
    MyErrorDirective,
    MyControlOptionsDirective,
    MySubmitIfValidAndDirtyDirective,
    MySubmitIfValidDirective,
    // extended Validators originaly from Angular, now with an embedded 'msg' property
    MyRequiredValidator,
    MyEmailValidator,
    MyMinLengthValidator,
    MyMaxLengthValidator,
    MyPatternValidator,
    MyCheckboxRequiredValidator,
  ],
  exports: [
    DebugFormComponent,
    DebugInputFieldComponent,
    MyErrorMessageComponent,
    MyErrorDirective,
    MyControlOptionsDirective,
    MySubmitIfValidAndDirtyDirective,
    MySubmitIfValidDirective,
    MyRequiredValidator,
    MyEmailValidator,
    MyMinLengthValidator,
    MyMaxLengthValidator,
    MyPatternValidator,
    MyCheckboxRequiredValidator,
  ],
  entryComponents: [MyErrorMessageComponent],
  providers: [
    DefaultAlertService,
    DefaultValidatorsService,
    DefaultMessagesService,
    {
      provide: MY_ALERT_SERVICE_API,
      useClass: DefaultAlertService
    },
    {
      provide: MY_MESSAGES_SERVICE_API,
      useClass: DefaultMessagesService
    },
    {
      provide: MY_VALIDATORS_SERVICE_API,
      useClass: DefaultValidatorsService
    },
    {
      provide: MY_SHOW_ERROR_MSG_FUNCTION_API,
      useValue: DEFAULT_SHOW_ERROR_MSG_FUNCTION
    }
  ]
})
export class MyValidatorsModule {
  static forRoot(showFunction: ShowFunction): ModuleWithProviders<MyValidatorsModule> {
    return {
      ngModule: MyValidatorsModule,
      providers: [
        {
          provide: MY_SHOW_ERROR_MSG_FUNCTION_API,
          useValue: showFunction
        }
      ]
    };

  }
}
