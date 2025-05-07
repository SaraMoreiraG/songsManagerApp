import { Injectable, signal, computed } from '@angular/core';
import { Song } from '../models/song.model';
import { SongsApiService } from '../services/songsApi.service';

@Injectable({ providedIn: 'root' })
export class SongsStore {
  private readonly songs = signal<Song[]>([]);
  private readonly loading = signal(false);

  readonly songsList = computed(() => this.songs());
  readonly isLoading = computed(() => this.loading());

  constructor(private api: SongsApiService) {}

  loadSongs() {
    this.loading.set(true);
    this.api.getSongs().subscribe({
      next: data => this.songs.set(data),
      complete: () => this.loading.set(false)
    });
  }

  addSong(song: Song) {
    this.api.createSong(song).subscribe(newSong => {
      this.songs.update(list => [...list, newSong]);
    });
  }

  deleteSong(id: number) {
    this.api.deleteSong(id).subscribe(() => {
      this.songs.update(list => list.filter(song => song.id !== id));
    });
  }
}
