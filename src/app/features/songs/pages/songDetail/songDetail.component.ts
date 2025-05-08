import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SongsApiService } from '../../services/songsApi.service';
import { Song } from '../../models/song.model';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './songDetail.component.html',
})
export class SongDetailComponent implements OnInit {
  // Injecting required Angular services
  private route = inject(ActivatedRoute);
  private api = inject(SongsApiService);
  private location = inject(Location);
  private router = inject(Router);

  // Song object to hold details of the selected song
  song!: Song;

  ngOnInit(): void {
    // Extract the song ID from the route and fetch its details
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getSongById(id).subscribe((s) => (this.song = s));
  }

  // Navigate back to the previous page
  goBack(): void {
    this.location.back();
  }

  // Delete the current song after user confirmation
  deleteSong(): void {
    if (!this.song || !this.song.id) return;

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${this.song.title}"?`
    );

    if (confirmed) {
      this.api.deleteSong(this.song.id).subscribe(() => {
        // After deletion, redirect to the list of songs
        this.router.navigate(['/songs']);
      });
    }
  }
}
