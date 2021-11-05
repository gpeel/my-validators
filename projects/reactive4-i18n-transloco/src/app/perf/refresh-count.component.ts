import {Component, Input} from '@angular/core';
import {Plog} from '@gpeel/plog';

@Component({
  selector: 'refresh-count',
  template: `{{onRefreshCounter()}}`
})
export class RefreshCountComponent {
  /**
   * the name of the refresh counter
   */
  @Input() name = '';
  counter = 1;

  onRefreshCounter() {
    Plog.perfComponent(`${this.name} ${this.counter++}`);
  }

}
