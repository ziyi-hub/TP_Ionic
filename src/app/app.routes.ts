
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
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
];
