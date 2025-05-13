import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { SongStore } from '../../state/song.store';
import { SongCardComponent } from '../../components/songCard/songCard.component';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, SongCardComponent, SpinnerComponent],
  templateUrl: './songList.component.html'
})
export class SongListComponent {
  private router = inject(Router);
  public store = inject(SongStore);
  public isLoading = this.store.isLoading;
  public songs = this.store.songs;

  constructor() {
    if (this.router.url === '/songs') {
      this.store.loadAll();
    }
  }

  goToDetail(id: string) {
    this.router.navigate(['/songs', id]);
  }

  goToCreateForm() {
    this.router.navigate(['/songs/new']);
  }
}


