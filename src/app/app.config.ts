import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MY_DATE_FORMATS } from './shared/types/date-format';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from './shared/directives/custom-mat-paginator-init';
import { provideNgxMask } from 'ngx-mask';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    [provideNgxMask()],
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
      provideHttpClient(),
       provideAnimationsAsync(),
        importProvidersFrom(MatNativeDateModule, MatDatepickerModule),
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
        { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl },
      ]
};
