import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongsApiService } from '../../services/songsApi.service';
import { Song } from '../../models/song.model';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './songList.component.html',
  styleUrls: ['./songList.component.css']
})
export class SongListComponent implements OnInit {
  // Injecting SongsApiService to interact with the API
  private readonly songsApi = inject(SongsApiService);

  // Array to store the list of songs
  songs: Song[] = [];

  ngOnInit(): void {
    // Fetching the list of songs when the component is initialized
    this.songsApi.getSongs().subscribe(data => {
      this.songs = data; // Assign the fetched songs to the songs array
    });
  }

  // Method to delete a song by its ID
  deleteSong(id: number) {
    this.songsApi.deleteSong(id).subscribe(() => {
      // Filtering out the deleted song from the songs array
      this.songs = this.songs.filter(song => song.id !== id);
    });
  }
}
