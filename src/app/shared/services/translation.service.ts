// src/app/shared/services/translation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Asegúrate de que esté aquí
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  loadTranslation(language: string): Observable<any> {
    const translationUrl = `assets/i18n/${language}.json`;
    return this.http.get<any>(translationUrl);
  }
}
