import { Post } from '../models/post';
import { TopicService } from '../services/topic.service';
import {Component, OnInit} from '@angular/core';
import {PostModalComponent} from "../components/post-modal/post-modal.component";
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../models/topic';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {IonFab,IonFabButton, ModalController, ToastController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline } from 'ionicons/icons';
import { UUID } from 'angular2-uuid';

@Component({
  standalone: true,
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
  imports : [ReactiveFormsModule, IonFab, IonFabButton,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem, CommonModule]
})

export class TopicDetailPage implements OnInit {
  posts: Post[] = [];
  topic: Topic | undefined;
  constructor(
    private topicService: TopicService,
    private modalController: ModalController,
    private toastController: ToastController,
    private route: ActivatedRoute,
  ) {}


  /**
   * Charger les topics lors de l'initialisation de la page
   */
  ngOnInit() {
    this.getCurrentTopic();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */

  getCurrentTopic(){
    this.route.params.subscribe(params => {
      const topicId = params['id'];
      this.topic = this.topicService.get(topicId);
  });
  }
  /**
   * Ouvrir fenetre Modal
   */
  async openModal() {
    const modal = await this.modalController.create({
      component: PostModalComponent,
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.topic) {
        const newPost = { id: UUID.UUID(), name: data.data.name, description: data.data.description }
        this.topicService.addPost(newPost, this.topic.id)
          .then(() => {
            this.presentToast(data.data.name, 'bottom', 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'bottom', 'danger');
          })
        this.getCurrentTopic();
       }
    });

    return await modal.present();
  }


  /**
   * show toast
   * @param nameTopic
   * @param position
   * @param color
   */
  async presentToast(nameTopic: string, position: 'bottom', color: string) {
    const toast = await this.toastController.create({
      message: 'Topic ' + nameTopic + " successfully updated",
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }

}

addIcons({
  'add-outline': addOutline,
  'trash-outline' : trashOutline
});
