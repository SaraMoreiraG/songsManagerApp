import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Artist } from '../models/artist.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistApiService {
  private baseUrl = 'http://localhost:3000/artists';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(this.baseUrl);
  }

  getById(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.baseUrl}/${id}`);
  }

  create(artist: Artist): Observable<Artist> {
    return this.http.post<Artist>(this.baseUrl, artist);
  }

  update(id: string, artist: Artist): Observable<Artist> {
    return this.http.put<Artist>(`${this.baseUrl}/${id}`, artist);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
