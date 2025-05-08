import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongsApiService } from '../../services/songsApi.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './songForm.component.html'
})
export class SongFormComponent implements OnInit {
  // Injecting the required services and dependencies for the component
  private readonly songsApi = inject(SongsApiService);  // Service for API calls related to songs
  private readonly fb = inject(FormBuilder);           // FormBuilder to handle the form group
  private readonly route = inject(ActivatedRoute);      // ActivatedRoute to access route parameters
  private readonly router = inject(Router);             // Router to navigate between views

  // Form group for managing song data in the form
  form: FormGroup;

  // Flags and variables related to form state
  isEditMode = false;   // Flag to track whether the form is in "edit" mode or "create" mode
  songId: number | null = null;  // Holds the song ID when in edit mode

  // Constructor to initialize the form group with default values
  constructor() {
    this.form = this.fb.group({
      poster: ['http://dummyimage.com/400x600.png/dddddd/000000'],  // Default poster image URL
      title: [''],  // Song title input field
      artist: [''], // Artist name input field
      year: [new Date().getFullYear()], // Default year set to current year
      duration: [''],  // Song duration input field
      rating: [''],    // Rating input field
      genreInput: [''] // Input for adding genres
    });
  }

  // ngOnInit lifecycle hook, which is triggered after component initialization
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id'); // Get the song ID from route parameters
    if (id) {
      this.isEditMode = true; // Set the flag to edit mode if an ID is present
      this.songId = +id; // Convert the ID to a number and assign it

      // Fetch song data by ID to populate the form in edit mode
      this.songsApi.getSongById(this.songId).subscribe(song => {
        this.form.patchValue(song);  // Populate the form with song data
        this.genres = Array.isArray(song.genre) ? song.genre : [];  // Handle genres as an array
      });
    }
  }

  // Method to handle form submission for both creating and updating a song
  onSubmit() {
    const songData = {
      ...this.form.value,
      genre: this.genres  // Include the genres selected in the form data
    };

    // If in edit mode, update the existing song
    if (this.isEditMode && this.songId) {
      this.songsApi.updateSong(this.songId, songData).subscribe(() => {
        this.router.navigate(['/songs']);  // Navigate to the songs list after update
      });
    } else {
      // If not in edit mode, create a new song
      this.songsApi.getSongs().subscribe(songs => {
        const lastId = Math.max(...songs.map(song => +song.id || 0)); // Get the last song ID
        const newSong = { ...songData, id: (lastId + 1).toString() }; // Create new song with incremented ID
        this.songsApi.createSong(newSong).subscribe(() => {
          this.router.navigate(['/songs']);  // Navigate to the songs list after creation
        });
      });
    }
  }

  // Array to store genres selected for the song
  genres: string[] = [];

  // Method to add a new genre to the genres array
  addGenre() {
    const input = this.form.get('genreInput')?.value || ''; // Get the genre input value
    const newGenres = input
      .split(/[\s,]+/)  // Split the input by spaces or commas
      .map((g: string) => g.trim())  // Trim any extra spaces
      .filter((g: string) => g && !this.genres.includes(g));  // Remove empty or duplicate genres

    this.genres.push(...newGenres); // Add new genres to the genres array
    this.form.get('genreInput')?.setValue(''); // Clear the genre input field
  }

  // Method to remove a genre from the genres array
  removeGenre(genre: string) {
    this.genres = this.genres.filter(g => g !== genre); // Remove the specified genre from the array
  }

  // Array for storing song labels (not in use in the template right now)
  labels: string[] = [];
  newLabel = '';

  // Method to add a new label to the labels array
  addLabel() {
    if (this.newLabel.trim()) {  // Only add non-empty labels
      this.labels.push(this.newLabel.trim()); // Add the trimmed label
      this.newLabel = ''; // Clear the input field
    }
  }

  // Method to remove a label from the labels array
  removeLabel(l: string) {
    this.labels = this.labels.filter(label => label !== l); // Remove the specified label from the array
  }
}
