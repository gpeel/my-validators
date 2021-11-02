export {MY_ALERT_SERVICE_API, MyAlertServiceInterface} from './alert/alert-api';
export {DebugFormComponent} from './debug-form/debug-form.component';
export {DebugInputFieldComponent} from './debug-form/debug-input-field.component';
export {ErrorMsgFn, ErrorMsgMap, MyErrorDirective, MyErrorMessageComponent,} from './error-messages/error-msg-api';
export {makeDirty, SubmitIfAbstractDirective} from './submit-button/submit-if-abstract.directive';
export {MySubmitIfValidAndDirtyDirective} from './submit-button/my-submit-if-valid-and-dirty.directive';
export {MySubmitIfValidDirective} from './submit-button/my-submit-if-valid.directive';
export {MyValidators} from './validators/solution-1/my-validators';
export * from './validators/solution-1/my-validators-directive';
export {
  HardCodedMsgValidatorsService
} from './validators/solution-2-validators-service/hard-coded-msg-validators.service';
export {DefaultValidatorsService} from './validators/solution-3-messages-service/default-validators.service';

export {DefaultMessagesService} from './validators/solution-3-messages-service/default-messages.service';

export * from './my-validators.module';
export {MyValidatorsServiceInterface} from './validators/validators-service-api';
export {
  MyMessagesServiceInterface, MY_MESSAGES_SERVICE_API
} from './validators/messages-service-api';
