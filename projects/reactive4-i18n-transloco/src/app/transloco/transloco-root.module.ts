import {HttpClient} from '@angular/common/http';
import {APP_INITIALIZER, Injectable, NgModule} from '@angular/core';
import {
  Translation,
  TRANSLOCO_CONFIG,
  TRANSLOCO_LOADER,
  translocoConfig,
  TranslocoLoader,
  TranslocoModule,
  TranslocoService
} from '@ngneat/transloco';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        availableLangs: ['en', 'fr'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader},
    {
      provide: APP_INITIALIZER, // loop to force execution of rootPlogFactory
      useFactory: loadFileFromRemoteFactory,
      multi: true,
      deps: [TranslocoService]
    },
  ]
})
export class TranslocoRootModule {
}

export function loadFileFromRemoteFactory(translocoService: TranslocoService) {
  return () => load(translocoService);
}

function load(translocoService: TranslocoService) {
  return new Promise<any>((resolve, reject) => {
    // console.log('INIIIIIIIIT transloco i18n files');
    translocoService.selectTranslation('validators/en').subscribe();
    translocoService.selectTranslation('validators/fr').subscribe();
    // translocoService.selectTranslation('validators/en').subscribe(value => console.log(value));
    // translocoService.selectTranslation('validators/fr').subscribe(value => console.log(value));
    resolve(null);
  });
}
