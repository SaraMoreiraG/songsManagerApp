import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({ providedIn: 'root' })
export class SongApiService {
  private readonly baseUrl = 'http://localhost:3000/songs';

  constructor(private http: HttpClient) {}

  // Get all songs
  getAll(): Observable<Song[]> {
    return this.http.get<Song[]>(this.baseUrl);
  }

  // Get song by ID
  getById(id: string): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/${id}`);
  }

  // Get multiple songs by a list of IDs
  getManyByIds(ids: number[]): Observable<Song[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.http.get<Song[]>(`${this.baseUrl}?${query}`);
  }

  // Create a new song
  create(song: Song): Observable<Song> {
    return this.http.post<Song>(this.baseUrl, song);
  }

  // Update an existing song
  update(id: string, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.baseUrl}/${id}`, song);
  }

  // Delete song by ID
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
