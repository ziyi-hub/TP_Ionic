
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'topic-detail/:id', 
    loadComponent: () => import('./topic-detail/topic-detail.page').then((m) => m.TopicDetailPage),
  }, 
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
