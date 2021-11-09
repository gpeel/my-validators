import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MY_ALERT_SERVICE_API, MY_MESSAGES_SERVICE_API, MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {MyPerfModule} from './perf/my-perf.module';
import {CvaComboComponent} from './reactive-all/cva-combo.component';
import {ReactiveAllComponent} from './reactive-all/reactive-all.component';
import {TranslocoRootModule} from './transloco/transloco-root.module';
import {AlertWithSimpleLogService} from './validators/alert-with-simple-log.service';
import {I18nMessagesService} from './validators/i18n-messages.service';
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
    // i18n
    HttpClientModule,
    TranslocoRootModule,
    //
    // pass a custom function to show error
    // By default the function is: (control: AbstractControl) => (control.dirty || control.touched)
    //
    // MyValidatorsModule.forRoot((control: AbstractControl) => (control.dirty || control.touched)),
    // MyValidatorsModule.forRoot((control: AbstractControl) => (control.touched)),
    MyValidatorsModule,
    // NOT interesting because (blur) will also turn into dirty with myErrorMsg
    // MyValidatorsModule.forRoot((control: AbstractControl) => (control.dirty)),
    PlogModule.forRoot(environment),
    MyPerfModule,
    NgbModule,
  ],
  providers: [
    I18nMessagesService,
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
      useClass: I18nMessagesService,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

