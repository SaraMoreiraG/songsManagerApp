import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ArtistStore } from '../../state/artist.store';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-artist-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './artistForm.component.html',
})
export class ArtistFormComponent {
  // Injecting necessary services
  private fb = inject(FormBuilder);
  private artistStore = inject(ArtistStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Form definition
  form: FormGroup;
  artistId: string | null = null;
  isEditMode = false;
  currentYear = new Date().getFullYear();

  constructor() {
    // Initialize form with validation rules
    this.form = this.fb.group({
      name: ['', Validators.required],
      bornCity: ['', Validators.required],
      birthDate: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
    });

    // Determine if we are in edit mode by checking for a artist ID
    this.artistId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.artistId;

    // If in edit mode, populate the form with existing artist data
    if (this.isEditMode && this.artistId) {
      this.artistStore.selectById(this.artistId);

      effect(() => {
        const artist = this.artistStore.selectedArtist();
        if (artist) {
          this.form.patchValue({
            name: artist.name,
            bornCity: artist.bornCity,
            birthDate: artist.birthDate,
            rating: artist.rating,
            img: artist.img,
            songs: artist.songs
          });
        }
      });
    } else {
      this.artistStore.clearSelection();
    }
  }

  // Handles form submission
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Mark all fields as touched to trigger validation
      return;
    }

    // Create the artist object to save
    const artistData: Artist = {
      id: this.isEditMode ? this.artistId! : this.artistStore.getNextId(),
      name: this.form.value.name,
      bornCity: this.form.value.bornCity,
      birthDate: this.form.value.birthDate,
      rating: this.form.value.rating,
      songs: this.isEditMode
      ? this.artistStore.selectedArtist()?.songs ?? []
      : [],
      songTitles: this.isEditMode
      ? this.artistStore.selectedArtist()?.songTitles ?? []
      : [],
      img: this.isEditMode
        ? this.artistStore.selectedArtist()?.img ?? 'http://dummyimage.com/400x600.png/dddddd/000000'
        : 'http://dummyimage.com/400x600.png/dddddd/000000',
    };

    // Update or create the artist depending on edit mode
    this.isEditMode
      ? this.artistStore.updateArtist(artistData)
      : this.artistStore.createArtist(artistData);

    // Navigate to the artist list after submission
    this.router.navigate(['/artists']);
  }

  // Navigates back to the previous page
  goBack() {
    this.router.navigate([this.isEditMode ? `/artists/${this.artistId}` : '/artists']);
  }
}
