import {Component} from '@angular/core';
import {TranslocoService} from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  template: `
    <root-refresh-count></root-refresh-count>
    <reactive-all>
      <div class="m-4">Only validators messages are switched between FR and EN, not labels => click there:
        <button (click)="changeLang()" class="btn btn-info m-1">Actual {{activeLang}} => Change to {{nextLang}}</button>
      </div>
    </reactive-all>

  `
})
export class AppComponent {

  activeLang: string;
  nextLang: string;

  constructor(public translocoService: TranslocoService) {
    this.activeLang = translocoService.getActiveLang();
    this.nextLang = 'fr';
  }

  changeLang() {
    console.log(this.activeLang);
    if (this.activeLang === 'fr') {
      this.translocoService.setActiveLang('en');
      this.activeLang = 'en';
      this.nextLang = 'fr';
    } else {
      this.translocoService.setActiveLang('fr');
      this.activeLang = 'fr';
      this.nextLang = 'en';
    }
  }
}
