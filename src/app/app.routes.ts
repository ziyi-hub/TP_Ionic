
import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: 'category-detail/:id',
    loadComponent: () => import('./pages/category-detail/category-detail.page').then((m) => m.CategoryDetailPage),
    canActivate: [AuthGuard]
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
    path: 'category-detail/:categoryId/recipe-detail/:id',
    loadComponent: () => import('./pages/recipe-detail/recipe-detail.page').then( m => m.RecipeDetailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'tab',
    loadComponent: () => import('./components/tab/tab.page').then( m => m.TabPage),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage),
        canActivate: [AuthGuard]
      },
    ],
  },
];
