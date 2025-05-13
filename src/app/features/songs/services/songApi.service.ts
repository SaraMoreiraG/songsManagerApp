import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { LoadingService } from '../../../shared/services/loading.service';
import { Song } from '../models/song.model';

@Injectable({ providedIn: 'root' })
export class SongApiService {
  private readonly baseUrl = 'http://localhost:3000/songs';

  constructor(private http: HttpClient, public loadingService: LoadingService) { }

  // Get all songs
  getAll(): Observable<Song[]> {
    console.log('Start loading songs...');
    this.loadingService.setLoading(true);  // Start loading
    return this.http.get<Song[]>(this.baseUrl).pipe(
      finalize(() => {
        console.log('Finished loading songs');
        this.loadingService.setLoading(false); // Stop loading once data is fetched
      }),
      catchError((error) => {
        console.error('Error loading songs:', error);
        this.loadingService.setLoading(false); // Stop loading if error occurs
        throw error;
      })
    );
  }

  // Get song by ID
  getById(id: string): Observable<Song> {
    console.log('Start loading song by ID...');
    this.loadingService.setLoading(true); // Start loading
    return this.http.get<Song>(`${this.baseUrl}/${id}`).pipe(
      finalize(() => {
        console.log('Finished loading song by ID');
        this.loadingService.setLoading(false); // Stop loading once data is fetched
      }),
      catchError((error) => {
        console.error('Error loading song by ID:', error);
        this.loadingService.setLoading(false); // Stop loading if error occurs
        throw error;
      })
    );
  }

  // Get multiple songs by a list of IDs
  getManyByIds(ids: number[]): Observable<Song[]> {
    const query = ids.map(id => `id=${id}`).join('&');
    return this.http.get<Song[]>(`${this.baseUrl}?${query}`).pipe(
      tap(() => this.loadingService.setLoading(false)), // Stop loading once data is fetched
      catchError((error) => {
        this.loadingService.setLoading(false); // Stop loading if error occurs
        throw error;
      })
    );
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
