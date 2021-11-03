import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MyValidatorsModule} from '@gpeel/my-validators';
import {PlogModule} from '@gpeel/plog';
import {environment} from '../environments/environment';

import {AppComponent} from './app.component';
import {ReactiveSimplestComponent} from './reactive-simplest/reactive-simplest.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveSimplestComponent,
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

