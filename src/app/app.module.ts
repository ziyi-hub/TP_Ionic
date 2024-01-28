import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { TopicModalComponent } from './components/topic-modal/topic-modal.component';
import { PostModalComponent } from './components/post-modal/post-modal.component';
import { ToastComponent } from "./components/toast/toast.component";
import { AppRoutingModule } from './app-routing.module';
import { TopicDetailPageModule } from './topic-detail/topic-detail.module';
import { HomePage } from "./home/home.page";

@NgModule({
  declarations: [AppComponent, TopicModalComponent, PostModalComponent, ToastComponent, HomePage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, TopicDetailPageModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
