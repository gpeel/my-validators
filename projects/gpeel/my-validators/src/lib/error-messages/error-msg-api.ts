export {MyErrorDirective} from './my-error.directive';
export {MyControlOptionsDirective} from './my-control-options.directive';
export {MyErrorMessageComponent} from './my-error-message.component';

export type ErrorMsgFn = (err: any) => string;
export type ErrorMsgMap = {
  [err: string]: string | ErrorMsgFn;
};


