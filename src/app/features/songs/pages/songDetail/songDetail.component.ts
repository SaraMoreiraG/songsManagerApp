import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SongStore } from '../../state/song.store';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './songDetail.component.html'
})
export class SongDetailComponent {
  private store = inject(SongStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  song: Song | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.selectById(id);
    }

    // Subscribe reactively to song changes
    effect(() => {
      this.song = this.store.selectedSong();
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  deleteSong() {
    if (this.song?.id) {
      this.store.deleteSong(this.song.id);
      this.goBack();
    }
  }
}
