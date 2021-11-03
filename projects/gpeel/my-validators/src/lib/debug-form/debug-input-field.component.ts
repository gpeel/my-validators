import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, NgForm} from '@angular/forms';
import {Plog} from '@gpeel/plog';

/**
 * Use:
 * <debug-input-field [group]="form" prop="nom"></debug-input-field>
 *
 * Output:
 *
 * Field.NOM.value = 'pipo'
 *    nom.blur||dirty = false || false
 *    nom.errors = {
 *      "required": {
 *        "msg": "'Nom' is required"
 *      }
 *
 */
// @formatter:off
@Component({
  selector: 'debug-input-field',
  template: `
    <pre style="font-size: 12px">

      Field.{{prop}}.value = {{control?.value}}
      {{prop}}.blur={{control?.touched}}
      {{prop}}.dirty={{control?.dirty}}
      {{prop}}.errors = {{control?.errors | json}}
    </pre>
  `,
  styles : [`
      pre {
          white-space: pre-line; /* CSS3 - Text module (Candidate Recommendation) http://www.w3.org/TR/css3-text/#white-space */
      }
  `]
})
// @formatter:on
export class DebugInputFieldComponent implements OnInit {
  @Input() group!: AbstractControl | NgForm;
  @Input() prop!: string;

  _control!: AbstractControl;

  /**
   * To solve most pb with NgModel very curious build sequence
   * ALSO that's why you have ? in the HTML
   */
  get control() {
    if (!this._control) {
      const v = (this.group as NgForm).controls[this.prop];
      // console.log('vvvvvvvvvvvvvvvvvv', v, this.prop, this.group, this.group.controls);
      return v;
    }
    return this._control;
  }


  ngOnInit() {
    if (this.group instanceof AbstractControl) {
      const local = this.group.get(this.prop);
      if (!local) {
        Plog.error(`Error accessing property ${this.prop} on formgroup: CONTROL is NULL`);
      } else {
        this._control = local;
      }
      // else {
      // this._control = this.group.controls[this.prop];
      // if (!this._control)
      // NOT an error, this is NORMAL with Template API
      // Plog.error(`Error accessing property ${this.prop} on formgroup: CONTROL is NULL`);
      // }
    }
  }
}
