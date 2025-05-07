import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SongListComponent } from './pages/songList/songList.component';
import { SongFormComponent } from './pages/songForm/songForm.component';

const routes: Routes = [
  { path: '', component: SongListComponent },
  { path: 'new', component: SongFormComponent },
  { path: 'edit/:id', component: SongFormComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    SongListComponent,
    SongFormComponent
  ]
})
export class SongsModule {}
