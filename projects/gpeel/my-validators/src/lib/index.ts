export {DebugFormComponent} from './debug-form/debug-form.component';
export {DebugInputFieldComponent} from './debug-form/debug-input-field.component';
export {
  ErrorMsgFn,
  ErrorMsgMap,
  MyErrorDirective,
  MyErrorMessageComponent,
  MyControlOptionsDirective
} from './error-messages/error-msg-api';
export {makeDirty, SubmitIfAbstractDirective} from './submit-button/submit-if-abstract.directive';
export {MySubmitIfValidAndDirtyDirective} from './submit-button/my-submit-if-valid-and-dirty.directive';
export {MySubmitIfValidDirective} from './submit-button/my-submit-if-valid.directive';

// as original validators but patched
export {MyValidators} from './validators/solution-1-simplest/my-validators';
export * from './validators/solution-1-simplest/my-validators-directive';


// with more flexible (pluggable) services/interfaces
export {
  MyValidatorsServiceInterface, MY_VALIDATORS_SERVICE_API
} from './pluggable-api/validators/validators-service-api';
export {MY_ALERT_SERVICE_API, MyAlertServiceInterface} from './pluggable-api/alert/alert-api';
export {
  MyMessagesServiceInterface, MY_MESSAGES_SERVICE_API,
  DEFAULT_SHOW_ERROR_MSG_FUNCTION, MY_SHOW_ERROR_MSG_FUNCTION_API
} from './pluggable-api/messages/messages-service-api';

// default implementtaion for those interfaces / Token
export {DefaultValidatorsService} from './pluggable-api/validators/default-validators.service';
export {DefaultMessagesService} from './pluggable-api/messages/default-messages.service';
export {DefaultAlertService} from './pluggable-api/alert/default-alert.service';

export * from './my-validators.module';
