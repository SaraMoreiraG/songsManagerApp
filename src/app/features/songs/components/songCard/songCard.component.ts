import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() clicked = new EventEmitter<string>();

  onClick() {
    this.clicked.emit(this.song.id);
  }
}
