import {Injectable} from '@angular/core';
import {ErrorMsgMap, MyMessagesServiceInterface} from '@gpeel/my-validators';
import {Plog} from '@gpeel/plog';
import {TranslocoService} from '@ngneat/transloco';


@Injectable()
export class I18nMessagesService implements MyMessagesServiceInterface {

  constructor(private translocoService: TranslocoService) {
  }

  getValidationMessageFor(key: string, errors: ErrorMsgMap = {}): string {
    const msg = this.translocoService.translate(key, errors, 'validators');
    Plog.validator('Message:', key, msg);
    return msg;
  }

}
