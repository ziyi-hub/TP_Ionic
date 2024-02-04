import { Post } from '../models/post';
import { TopicService } from '../services/topic.service';
import {Component, OnInit, inject} from '@angular/core';
import {PostModalComponent} from "../components/post-modal/post-modal.component";
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../models/topic';
import { ReactiveFormsModule } from '@angular/forms';
import {IonFab,IonFabButton, ModalController, ToastController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline } from 'ionicons/icons';
import { UUID } from 'angular2-uuid';

@Component({
  standalone: true,
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
  imports : [ReactiveFormsModule, IonFab, IonFabButton,IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem]
})

export class TopicDetailPage implements OnInit {
  posts: Post[] = [];
  topic: Topic | undefined;
  private readonly topicService = inject(TopicService); 
  private readonly modalController= inject(ModalController);
  private readonly toastController =  inject(ToastController);
  private readonly route = inject(ActivatedRoute);

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
  async createPost() {
    const modal = await this.modalController.create({
      component: PostModalComponent,
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.topic) {
        const newPost = { id: UUID.UUID(), name: data.data.name, description: data.data.description }
        this.topicService.addPost(newPost, this.topic.id)
          .then(() => {
            const message = "This post" + data.data.name + " is successfully created."
            this.presentToast(message, 'bottom', 'success');
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
  async presentToast(message: string, position: 'bottom', color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }
  async deletePost(postId:string){
    if(this.topic)
      this.topicService.deletePost(postId, this.topic.id) 
      .then(() => {
        const message = "Post successfully deleted."
        this.presentToast(message, 'bottom', 'success');
      })
      .catch((err) => {
        this.presentToast(err, 'bottom', 'danger');
      })
  }
  async editPost(postId: string) {
    const modal = await this.modalController.create({
      component: PostModalComponent,
      componentProps: {
        postId: postId,
        topicId: this.topic?.id
      }
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.topic) {
        const post = { id: postId, name: data.data.name, description: data.data.description }
        this.topicService.updatePost(post, this.topic.id)
          .then(() => {
            const message = "This post" + data.data.name + " is successfully updated."
            this.presentToast(message, 'bottom', 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'bottom', 'danger');
          })
        this.getCurrentTopic(); 
       }
    });

    return await modal.present();
  }


}

addIcons({
  'add-outline': addOutline,
  'trash-outline' : trashOutline,
  'pencil-outline' : pencilOutline
});
