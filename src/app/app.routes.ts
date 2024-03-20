
import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: 'topic-detail/:id',
    loadComponent: () => import('./pages/topic-detail/topic-detail.page').then((m) => m.TopicDetailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'topic-detail/:topicId/post-detail/:id',
    loadComponent: () => import('./pages/post-detail/post-detail.page').then( m => m.PostDetailPage),
    canActivate: [AuthGuard]
  },
];
