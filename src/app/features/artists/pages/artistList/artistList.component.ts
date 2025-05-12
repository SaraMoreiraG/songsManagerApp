import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArtistStore } from '../../state/artist.store';
import { ArtistCardComponent } from '../../components/artistCard/artistCard.component';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, ArtistCardComponent],
  templateUrl: './artistList.component.html'
})
export class ArtistListComponent {
  private router = inject(Router);
  public store = inject(ArtistStore);

  // Accedemos directamente al signal computado
  public artists = this.store.artists;

  constructor() {
    this.store.loadAll(); // Carga inicial de canciones
  }

  goToDetail(id: string) {
    this.router.navigate(['/artists', id]);
  }

  goToCreateForm() {
    this.router.navigate(['/artists/new']);
  }
}
