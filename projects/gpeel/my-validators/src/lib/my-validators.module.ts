import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MyPerfModule} from '@gpeel/my-perf-tools';
import {MY_ALERT_SERVICE_API} from './alert/alert-api';
import {DefaultAlertService} from './alert/default-alert.service';
import {DebugFormComponent} from './debug-form/debug-form.component';
import {DebugInputFieldComponent} from './debug-form/debug-input-field.component';
import {MyErrorMessageComponent} from './error-messages/my-error-message.component';
import {MyErrorDirective} from './error-messages/my-error.directive';
import {MySubmitIfValidAndDirtyDirective} from './submit-button/my-submit-if-valid-and-dirty.directive';
import {MySubmitIfValidDirective} from './submit-button/my-submit-if-valid.directive';
import {MY_MESSAGES_SERVICE_API} from './validators/messages-service-api';
import {
  MyCheckboxRequiredValidator,
  MyEmailValidator,
  MyMaxLengthValidator,
  MyMinLengthValidator,
  MyPatternValidator,
  MyRequiredValidator
} from './validators/solution-1/my-validators-directive';
import {HardCodedMsgValidatorsService} from './validators/solution-2-validators-service/hard-coded-msg-validators.service';
import {DefaultMessagesService} from './validators/solution-3-messages-service/default-messages.service';
import {DefaultValidatorsService} from './validators/solution-3-messages-service/default-validators.service';


@NgModule({
  imports: [
    CommonModule,
    MyPerfModule,
  ],
  declarations: [
    DebugFormComponent,
    DebugInputFieldComponent,
    MyErrorMessageComponent,
    MyErrorDirective,
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
    HardCodedMsgValidatorsService,
    DefaultValidatorsService,
    DefaultMessagesService,
    {
      provide: MY_ALERT_SERVICE_API,
      useClass: DefaultAlertService
    },
    {
      provide: MY_MESSAGES_SERVICE_API,
      useClass: DefaultMessagesService
    }
  ]
})
export class MyValidatorsModule {
}
