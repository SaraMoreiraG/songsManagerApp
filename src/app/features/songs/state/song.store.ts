import { Injectable, computed, signal, inject } from '@angular/core';
import { Song } from '../models/song.model';
import { SongApiService } from '../services/songApi.service';
import { ArtistApiService } from '../../artists/services/artistApi.service';

@Injectable({ providedIn: 'root' })
export class SongStore {
  // Injecting the necessary services
  private readonly songApi = inject(SongApiService);
  private readonly artistApi = inject(ArtistApiService);

  // Reactive state: songs list, selected song, and loading state
  private songsSignal = signal<Song[]>([]);
  private selectedSongSignal = signal<Song | null>(null);
  private isLoadingSignal = signal<boolean>(false);

  // Exposed computed signals for UI consumption
  readonly songs = computed(() => this.songsSignal());
  readonly selectedSong = computed(() => this.selectedSongSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());

  // Load all songs and enrich them with artist names
  loadAll(): void {
    this.isLoadingSignal.set(true); // Start loading

    // Fetch all songs from the API
    this.songApi.getAll().subscribe(
      (songs) => {
        const uniqueArtistIds = Array.from(new Set(songs.map((song) => song.artist)));

        // Fetch all artists
        this.artistApi.getAll().subscribe(
          (artists) => {
            const artistMap = new Map<string, string>(
              artists.map((artist) => [String(artist.id), artist.name])
            );

            // Enrich songs with artist names
            const enrichedSongs = songs.map((song) => ({
              ...song,
              artistName: artistMap.get(String(song.artist)) || '🎤 Unknown',
            }));

            // Update the songs list in the store
            this.songsSignal.set(enrichedSongs);
            this.isLoadingSignal.set(false); // Stop loading
          },
          () => {
            this.isLoadingSignal.set(false); // Stop loading if artist fetch fails
          }
        );
      },
      () => {
        this.isLoadingSignal.set(false); // Stop loading if song fetch fails
      }
    );
  }

  // Select a song by ID and attach the artist name
  selectById(id: string): void {
    this.isLoadingSignal.set(true); // Start loading for this specific song

    // Fetch the song by ID
    this.songApi.getById(id).subscribe(
      (song) => {
        // Fetch the artist details for this song
        this.artistApi.getById(song.artist).subscribe(
          (artist) => {
            const enrichedSong = {
              ...song,
              artistName: artist.name,
            } as Song;

            // Update the selected song in the store
            this.selectedSongSignal.set(enrichedSong);
            this.isLoadingSignal.set(false); // Stop loading
          },
          () => {
            this.isLoadingSignal.set(false); // Stop loading if artist fetch fails
          }
        );
      },
      () => {
        this.isLoadingSignal.set(false); // Stop loading if song fetch fails
      }
    );
  }

  // Update an existing song and sync the updated artist name
  updateSong(song: Song): void {
    this.isLoadingSignal.set(true); // Start loading

    // Update the song in the API
    this.songApi.update(song.id, song).subscribe(
      (updated) => {
        // Fetch the artist details for the updated song
        this.artistApi.getById(updated.artist).subscribe(
          (artist) => {
            const enrichedUpdated = {
              ...updated,
              artistName: artist.name,
            };

            // Update the selected song and the songs list in the store
            this.selectedSongSignal.set(enrichedUpdated);
            this.songsSignal.update((current) =>
              current.map((s) => (s.id === updated.id ? enrichedUpdated : s))
            );
            this.isLoadingSignal.set(false); // Stop loading
          },
          () => {
            this.isLoadingSignal.set(false); // Stop loading if artist fetch fails
          }
        );
      },
      () => {
        this.isLoadingSignal.set(false); // Stop loading if song update fails
      }
    );
  }

  // Create a new song and append it to the current list
  createSong(song: Song): void {
    this.isLoadingSignal.set(true); // Start loading

    // Create the new song in the API
    this.songApi.create(song).subscribe(
      (created) => {
        // Add the newly created song to the songs list
        this.songsSignal.update((current) => [...current, created]);
        this.isLoadingSignal.set(false); // Stop loading
      },
      () => {
        this.isLoadingSignal.set(false); // Stop loading if song creation fails
      }
    );
  }

  // Delete a song by ID
  deleteSong(id: string): void {
    this.isLoadingSignal.set(true); // Start loading

    // Delete the song from the API
    this.songApi.delete(id).subscribe(
      () => {
        // Remove the deleted song from the songs list
        this.songsSignal.update((current) => current.filter((s) => s.id !== id));
        this.isLoadingSignal.set(false); // Stop loading
      },
      () => {
        this.isLoadingSignal.set(false); // Stop loading if song deletion fails
      }
    );
  }

  // Clear the selected song from the state
  clearSelection(): void {
    this.selectedSongSignal.set(null);
  }

  // Get the next available song ID based on the current list
  getNextId(): string {
    const ids = this.songs()
      .map((song) => Number(song.id))
      .filter((id) => !isNaN(id));

    const nextId = Math.max(0, ...ids) + 1;
    return String(nextId);
  }
}
