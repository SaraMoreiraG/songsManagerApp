import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SongStore } from '../../state/song.store';
import { ArtistApiService } from '../../../artists/services/artistApi.service';
import { Song } from '../../models/song.model';
import { Artist } from '../../../artists/models/artist.model';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './songForm.component.html',
})
export class SongFormComponent {
  // Injecting necessary services
  private fb = inject(FormBuilder);
  private songStore = inject(SongStore);
  private artistApiService = inject(ArtistApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Form definition
  form: FormGroup;
  allArtists: Artist[] = [];
  genres: string[] = [];
  songId: string | null = null;
  isEditMode = false;
  currentYear = new Date().getFullYear();

  constructor() {
    // Initialize form with validation rules
    this.form = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      genreInput: [''],
      duration: ['', Validators.required],
      year: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
      ],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });

    // Fetch all artists for the select dropdown
    this.artistApiService.getAll().subscribe((artists) => {
      this.allArtists = artists;
    });

    // Determine if we are in edit mode by checking for a song ID
    this.songId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.songId;

    // If in edit mode, populate the form with existing song data
    if (this.isEditMode && this.songId) {
      this.songStore.selectById(this.songId);

      effect(() => {
        const song = this.songStore.selectedSong();
        if (song) {
          this.form.patchValue({
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            year: song.year,
            rating: song.rating,
            poster: song.poster,
          });
          this.genres = song.genre;
        }
      });
    } else {
      this.songStore.clearSelection();
    }
  }

  // Adds a new genre to the genre list
  addGenre() {
    const input = this.form.get('genreInput')?.value?.trim();
    if (input && !this.genres.includes(input)) {
      this.genres.push(input);
      this.form.get('genreInput')?.setValue('');
    }
  }

  // Removes a genre from the list
  removeGenre(genre: string) {
    this.genres = this.genres.filter((g) => g !== genre);
  }

  // Handles form submission
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Mark all fields as touched to trigger validation
      return;
    }

    // Create the song object to save
    const songData: Song = {
      id: this.isEditMode ? this.songId! : this.songStore.getNextId(),
      title: this.form.value.title,
      artist: this.form.value.artist,
      genre: this.genres,
      duration: this.form.value.duration,
      year: this.form.value.year,
      rating: this.form.value.rating,
      poster: this.isEditMode
        ? this.songStore.selectedSong()?.poster ?? 'http://dummyimage.com/400x600.png/dddddd/000000'
        : 'http://dummyimage.com/400x600.png/dddddd/000000',
    };

    // Update or create the song depending on edit mode
    this.isEditMode
      ? this.songStore.updateSong(songData)
      : this.songStore.createSong(songData);

    // Navigate to the song list after submission
    this.router.navigate(['/songs']);
  }

  // Navigates back to the previous page
  goBack() {
    this.router.navigate([this.isEditMode ? `/songs/${this.songId}` : '/songs']);
  }
}
