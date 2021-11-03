import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {CvaComboComponent} from './reactive-all/cva-combo.component';
import {ReactiveAllComponent} from './reactive-all/reactive-all.component';

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
  bootstrap: [AppComponent]
})
export class AppModule {
}

