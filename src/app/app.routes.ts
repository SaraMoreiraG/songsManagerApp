import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'songs',
    pathMatch: 'full'
  },
  {
    path: 'songs',
    loadChildren: () =>
      import('./features/songs/songs.module').then(m => m.SongsModule),
    data: { title: 'Canciones' },
  },
];
