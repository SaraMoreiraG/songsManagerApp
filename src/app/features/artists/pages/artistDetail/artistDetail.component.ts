import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArtistStore } from '../../state/artist.store';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artistDetail.component.html',
})
export class ArtistDetailComponent {
  private store = inject(ArtistStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  artist: Artist | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.selectById(id);
    }

    // Subscribe reactively to artist changes
    effect(() => {
      this.artist = this.store.selectedArtist();
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  deleteArtist() {
    if (this.artist?.id) {
      this.store.deleteArtist(this.artist.id);
      this.goBack();
    }
  }
}
