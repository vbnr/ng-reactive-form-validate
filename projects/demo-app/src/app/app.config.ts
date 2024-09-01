import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  Injectable,
  inject,
  isDevMode,
} from '@angular/core';
import { Translation, TranslocoLoader } from '@ngneat/transloco';

import { provideTransloco } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
