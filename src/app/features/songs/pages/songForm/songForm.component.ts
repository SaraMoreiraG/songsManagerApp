import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongsApiService } from '../../services/songsApi.service';
import { Song } from '../../models/song.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-song-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './songForm.component.html',
  styleUrls: ['./songForm.component.css'],
})
export class SongFormComponent implements OnInit {
  // Injecting required services and dependencies
  private readonly songsApi = inject(SongsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Form group initialization for song data
  form: FormGroup;
  isEditMode = false; // Flag to check if it's in edit mode
  songId: number | null = null; // Song ID for edit mode

  constructor() {
    // Initializing the form group with default values
    this.form = this.fb.group({
      title: [''],
      artist: [''],
      year: [new Date().getFullYear()],
    });
  }

  ngOnInit(): void {
    // Check if there's a song ID in the route parameters
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true; // Set to edit mode if ID exists
      this.songId = +id; // Convert string to number for ID
      // Fetch the song data and patch the form values
      this.songsApi.getSongById(this.songId).subscribe(song => {
        this.form.patchValue(song);
      });
    }
  }

  // Handle form submission for creating or updating a song
  onSubmit() {
    const songData = this.form.value; // Extract form data
    if (this.isEditMode && this.songId) {
      // If in edit mode, update the song
      this.songsApi.updateSong(this.songId, songData).subscribe(() => {
        this.router.navigate(['/songs']); // Redirect to song list after update
      });
    } else {
      // If not in edit mode, create a new song
      this.songsApi.createSong(songData).subscribe(() => {
        this.router.navigate(['/songs']); // Redirect to song list after creation
      });
    }
  }

  // Arrays for storing genres and labels
  genres: string[] = [];
  newGenre = '';

  // Method to add a new genre
  addGenre() {
    if (this.newGenre.trim()) {
      this.genres.push(this.newGenre.trim()); // Add the genre if it's not empty
      this.newGenre = ''; // Clear the input field
    }
  }

  // Method to remove a genre from the list
  removeGenre(g: string) {
    this.genres = this.genres.filter(genre => genre !== g); // Filter out the genre
  }

  // Arrays for storing labels
  labels: string[] = [];
  newLabel = '';

  // Method to add a new label
  addLabel() {
    if (this.newLabel.trim()) {
      this.labels.push(this.newLabel.trim()); // Add the label if it's not empty
      this.newLabel = ''; // Clear the input field
    }
  }

  // Method to remove a label from the list
  removeLabel(l: string) {
    this.labels = this.labels.filter(label => label !== l); // Filter out the label
  }
}
