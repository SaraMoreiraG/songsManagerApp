import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongsApiService {
  private readonly baseUrl = 'http://localhost:3000/songs';

  constructor(private http: HttpClient) {}

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.baseUrl);
  }

  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/${id}`);
  }

  createSong(song: Omit<Song, 'id'>): Observable<Song> {
    return this.http.post<Song>(this.baseUrl, song);
  }

  updateSong(id: number, song: Omit<Song, 'id'>): Observable<Song> {
    return this.http.put<Song>(`${this.baseUrl}/${id}`, song);
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
