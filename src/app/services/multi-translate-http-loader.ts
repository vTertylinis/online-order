import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface TranslateNamespaceResource {
  prefix: string;
  namespace: string;
}

/**
 * Custom TranslateLoader that loads multiple JSON files per language
 * and merges them under namespaced keys.
 *
 * Example: for resources [{prefix: './assets/i18n/', namespace: 'common'}, ...]
 * loading language 'el' will fetch ./assets/i18n/el/common.json
 * and merge result under { "common": { ... } }
 */
export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private resources: TranslateNamespaceResource[]
  ) {}

  getTranslation(lang: string): Observable<Record<string, any>> {
    const requests = this.resources.map(resource =>
      this.http
        .get<Record<string, any>>(`${resource.prefix}${lang}/${resource.namespace}.json`)
        .pipe(catchError(() => of({})))
    );

    return forkJoin(requests).pipe(
      map(responses => {
        const merged: Record<string, any> = {};
        responses.forEach((response, index) => {
          merged[this.resources[index].namespace] = response;
        });
        return merged;
      })
    );
  }
}
