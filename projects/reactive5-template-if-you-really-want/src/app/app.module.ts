import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MY_ALERT_SERVICE_API, MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {environment} from '../environments/environment';
import {AlertWithSimpleLogService} from './alert-with-simple-log.service';

import {AppComponent} from './app.component';
import {UserFormTemplateComponent} from './template-form/user-form-template..component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormTemplateComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    //
    MyValidatorsModule,
    PlogModule.forRoot(environment),
    //
  ],
  providers: [
    // Providing MY_ALERT_SERVICE_API is useful only for the submit directive feature (mySubmitIfValidAndDirty)="onSend()"
    {
      provide: MY_ALERT_SERVICE_API,
      useClass: AlertWithSimpleLogService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

