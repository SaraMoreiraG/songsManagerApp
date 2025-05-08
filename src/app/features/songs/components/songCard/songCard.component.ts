import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './songCard.component.html'
})
export class SongCardComponent {
  @Input() song!: Song;
}
