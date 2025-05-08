import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SongListComponent } from './pages/songList/songList.component';
import { SongFormComponent } from './pages/songForm/songForm.component';
import { SongDetailComponent } from './pages/songDetail/songDetail.component';

const routes: Routes = [
  { path: '', component: SongListComponent, data: { title: 'Canciones' } },
  { path: 'new', component: SongFormComponent, data: { title: 'Nueva canción' } },
  { path: 'edit/:id', component: SongFormComponent, data: { title: 'Editar canción' } },
  { path: ':id', component: SongDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SongsModule { }
