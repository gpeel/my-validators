import {Component, Input} from '@angular/core';
import {AbstractControl, NgForm} from '@angular/forms';

/**
 * Use:
 *   <debug-form [form]="form"></debug-form>
 *
 *  Output:
 *
 *  FORM.value {
 *    "nom": null,
 *    "prenom": null,
 *    "nationaliteId": null
 *   }
 *   FORM.dirty=false   FORM.valid=false
 */
@Component({
  selector: 'debug-form',
  template: `
    <div>
      <div>
<pre style="font-size: 12px">
FORM.dirty={{form.dirty}}
FORM.valid={{form.valid}}
FORM.value {{form.value | json}}
</pre>
      </div>
    </div>
  `,
})
export class DebugFormComponent {

  @Input() form!: AbstractControl | NgForm;
}
