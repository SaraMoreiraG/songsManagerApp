import { Injectable, computed, signal, inject } from '@angular/core';
import { Song } from '../models/song.model';
import { SongApiService } from '../services/songApi.service';
import { ArtistApiService } from '../../artists/services/artistApi.service';

@Injectable({ providedIn: 'root' })
export class SongStore {
  private readonly songApi = inject(SongApiService);
  private readonly artistApi = inject(ArtistApiService);

  // Reactive state for song list and selected song
  private songsSignal = signal<Song[]>([]);
  private selectedSongSignal = signal<Song | null>(null);

  // Exposed computed signals
  readonly songs = computed(() => this.songsSignal());
  readonly selectedSong = computed(() => this.selectedSongSignal());

  // Load all songs and enrich them with artist names
  loadAll(): void {
    this.songApi.getAll().subscribe(songs => {
      const uniqueArtistIds = Array.from(new Set(songs.map(song => song.artist)));

      this.artistApi.getAll().subscribe(artists => {
        const artistMap = new Map<string, string>(
          artists.map(artist => [String(artist.id), artist.name])
        );

        const enrichedSongs = songs.map(song => ({
          ...song,
          artistName: artistMap.get(String(song.artist)) || '🎤 Unknown'
        }));

        this.songsSignal.set(enrichedSongs);
      });
    });
  }

  // Select a song by ID and attach the artist name
  selectById(id: string): void {
    this.songApi.getById(id).subscribe(song => {
      this.artistApi.getById(Number(song.artist)).subscribe(artist => {
        const enrichedSong = {
          ...song,
          artistName: artist.name
        } as Song;

        this.selectedSongSignal.set(enrichedSong);
      });
    });
  }

  // Update an existing song and sync the updated artist name
  updateSong(song: Song): void {
    this.songApi.update(song.id, song).subscribe(updated => {
      this.artistApi.getById(Number(updated.artist)).subscribe(artist => {
        const enrichedUpdated = {
          ...updated,
          artistName: artist.name
        };

        this.selectedSongSignal.set(enrichedUpdated);

        this.songsSignal.update(current =>
          current.map(s => (s.id === updated.id ? enrichedUpdated : s))
        );
      });
    });
  }

  // Create a new song and append it to the current list
  createSong(song: Song): void {
    this.songApi.create(song).subscribe(created => {
      this.songsSignal.update(current => [...current, created]);
    });
  }

  // Delete a song by ID
  deleteSong(id: string): void {
    this.songApi.delete(id).subscribe(() => {
      this.songsSignal.update(current => current.filter(s => s.id !== id));
    });
  }

  // Clear the selected song from state
  clearSelection(): void {
    this.selectedSongSignal.set(null);
  }

  // Get the next available song ID based on the current list
  getNextId(): string {
    const ids = this.songs()
      .map(song => Number(song.id))
      .filter(id => !isNaN(id));

    const nextId = Math.max(0, ...ids) + 1;
    return String(nextId);
  }
}
