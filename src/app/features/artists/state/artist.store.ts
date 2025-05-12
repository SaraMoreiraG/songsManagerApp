import { Injectable, computed, signal, inject } from '@angular/core';
import { Artist } from '../models/artist.model';
import { SongApiService } from '../../songs/services/songApi.service';
import { ArtistApiService } from '../services/artistApi.service';

@Injectable({ providedIn: 'root' })
export class ArtistStore {
  private readonly artistApi = inject(ArtistApiService);
  private readonly songApi = inject(SongApiService);

  private artistsSignal = signal<Artist[]>([]);
  private selectedArtistSignal = signal<Artist | null>(null);

  readonly artists = computed(() => this.artistsSignal());
  readonly selectedArtist = computed(() => this.selectedArtistSignal());

  loadAll(): void {
    this.artistApi.getAll().subscribe(artists => {
      const songIds = artists.flatMap(a => a.songs || []);
      const uniqueSongIds = Array.from(new Set(songIds));

      this.songApi.getManyByIds(uniqueSongIds).subscribe(songs => {
        const songMap = new Map<number, string>(
          songs.map(song => [Number(song.id), song.title])
        );

        const enriched = artists.map(artist => ({
          ...artist,
          songTitles: (artist.songs || []).map(id => songMap.get(Number(id)) || '🎵 Desconocida')
        }));

        this.artistsSignal.set(enriched);
      });
    });
  }

  selectById(id: string): void {
    this.artistApi.getById(id).subscribe(artist => {
      const songIds = artist.songs || [];

      this.songApi.getManyByIds(songIds.map(Number)).subscribe(songs => {
        const songMap = new Map<string, string>(
          songs.map(song => [String(song.id), song.title])
        );

        const enriched = {
          ...artist,
          songTitles: songIds.map(id => songMap.get(String(id)) || '🎵 Desconocida')
        };

        this.selectedArtistSignal.set(enriched);
      });
    });
  }

  createArtist(artist: Artist): void {
    this.artistApi.create(artist).subscribe(created => {
      this.artistsSignal.update(current => [...current, created]);
    });
  }

  updateArtist(artist: Artist): void {
    this.artistApi.update(artist.id, artist).subscribe(updated => {
      this.songApi.getManyByIds(updated.songs || []).subscribe(songs => {
        const enriched = {
          ...updated,
          songTitles: songs.map(s => s.title)
        };

        this.selectedArtistSignal.set(enriched);

        this.artistsSignal.update(current =>
          current.map(a => (a.id === enriched.id ? enriched : a))
        );
      });
    });
  }

  deleteArtist(id: string): void {
    this.artistApi.delete(id).subscribe(() => {
      this.artistsSignal.update(current => current.filter(a => a.id !== id));
    });
  }

  clearSelection(): void {
    this.selectedArtistSignal.set(null);
  }

  getNextId(): string {
    const ids = this.artists()
      .map(artist => Number(artist.id))
      .filter(id => !isNaN(id));

    const nextId = Math.max(0, ...ids) + 1;
    return String(nextId);
  }
}
