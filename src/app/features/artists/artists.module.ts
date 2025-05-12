import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { ArtistListComponent } from './pages/artistList/artistList.component';
import { ArtistFormComponent } from './pages/artistForm/artistForm.component';
import { ArtistDetailComponent } from './pages/artistDetail/artistDetail.component';

const routes: Routes = [
  { path: '', component: ArtistListComponent, data: { title: 'Artistas' } },
  { path: 'new', component: ArtistFormComponent, data: { title: 'Nuevo artista' } },
  { path: 'edit/:id', component: ArtistFormComponent, data: { title: 'Editar artista' } },
  { path: ':id', component: ArtistDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule
  ]
})
export class ArtistsModule { }
