import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artistCard.component.html'
})
export class ArtistCardComponent {
  @Input() artist!: Artist;
  @Output() clicked = new EventEmitter<string>();

  onClick() {
    this.clicked.emit(this.artist.id);
  }
}
