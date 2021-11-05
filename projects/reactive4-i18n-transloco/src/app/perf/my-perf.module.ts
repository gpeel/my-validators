import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RefreshCountComponent} from './refresh-count.component';
import {RootRefreshCountComponent} from './root-refresh-count.component';

@NgModule({
  declarations: [RefreshCountComponent, RootRefreshCountComponent],
  imports: [
    CommonModule,
  ],
  exports: [RefreshCountComponent, RootRefreshCountComponent]
})
export class MyPerfModule {
}
