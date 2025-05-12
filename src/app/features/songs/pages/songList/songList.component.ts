import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SongStore } from '../../state/song.store';
import { SongCardComponent } from '../../components/songCard/songCard.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, SongCardComponent],
  templateUrl: './songList.component.html'
})
export class SongListComponent {
  private router = inject(Router);
  public store = inject(SongStore);

  // Accedemos directamente al signal computado
  public songs = this.store.songs;

  constructor() {
    this.store.loadAll(); // Carga inicial de canciones
  }

  goToDetail(id: string) {
    this.router.navigate(['/songs', id]);
  }

  goToCreateForm() {
    this.router.navigate(['/songs/new']);
  }
}
