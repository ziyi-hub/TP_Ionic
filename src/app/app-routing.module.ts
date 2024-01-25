import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TopicDetailPage } from './topic-detail/topic-detail.page';
import { HomePage } from './home/home.page';

const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'topic-detail/:id', component: TopicDetailPage }, // Paramètre id dans l'URL
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
