import {Component, DoCheck} from '@angular/core';
import {Plog} from '@gpeel/plog';

/**
 * the root counter counts the CD check to have the number of global refresh cycles
 */
@Component({
  selector: 'root-refresh-count',
  template: `{{onRefreshDomCounter()}}`,
})
export class RootRefreshCountComponent implements DoCheck {

  counter: number = 1;
  counterDom: number = 1;

  /* tslint:disable:curly */
  constructor() {
    Plog.createComponent('RootRefreshCountComponent');
  }

  ngDoCheck(): void { // Called at the beginning of every change detection run
    Plog.perfCD(`CD ${this.counter++}`);
  }

  onRefreshDomCounter() {
    Plog.perfDom(`dom ${this.counterDom++}`);
  }

}
