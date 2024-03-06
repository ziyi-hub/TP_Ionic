import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { TopicModalComponent } from '../components/topic-modal/topic-modal.component';
import { ModalController, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline} from 'ionicons/icons';
import { UUID } from 'angular2-uuid';

import {map, Observable} from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonFabButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonLabel,
    IonItem,
    AsyncPipe,
  ],
})

export class HomePage extends UtilitiesMixin{
  private readonly topicService = inject(TopicService);
  private readonly modalController = inject(ModalController);
  private readonly router = inject(Router);
  topics$: Observable<Topic[]> = this.topicService.getAllTopics();


  /**
   * Ouvrir Modal Topic
   */
  async createTopic() {
    const modal = await this.modalController.create({
      component: TopicModalComponent,
    });

    modal.onWillDismiss().then((data) => {
      if (!!data && data.data) {
        const newTopic = { id: UUID.UUID(), name: data.data, posts: [] }
        this.topicService.addTopic(newTopic)
          .then((topicAdded: any) => {
            const message =  topicAdded.name + " is successfully created."
            this.presentToast(message, 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'danger');
          })
      }
    });

    return await modal.present();
  }

  /**
   * Redirect page
   * @param topicId
   */
  navigateToDetail(topicId: string) {
    this.router.navigate(['/topic-detail', topicId]);
  }

  /**
   * Mise à jour un topic
   * @param topicId
   */
  async updateTopic(topicId: string) {
    const modal = await this.modalController.create({
      component: TopicModalComponent,
      componentProps: {
        topicId: topicId
      }
    });

    modal.onWillDismiss().then((data) => {
      if (!!data && data.data) {
          const updatedTopic = { id: topicId, name: data.data, posts: [] }
          this.topicService.updateTopic(updatedTopic)
            .then((topicUpdated: any) => {
              const message = topicUpdated.name + " is successfully updated."
              this.presentToast(message, 'success');
            })
            .catch((err) => {
              this.presentToast(err, 'danger');
            })
      }
    });
    return await modal.present();
  }

  /**
   * Suppression un topic
   * @param topicId
   */
  async deleteTopic(topicId: string){
    this.subscription = this.topicService.getTopicById(topicId).subscribe({
      next: (value: any) => {
        if (value && value.name) {
          this.topicService.deleteTopic(topicId)
            .then((isDeleted: any) => {
              if(isDeleted === true){
                const message = value.name + " is succesfully deleted.";
                this.presentToast(message,  'success')
              }
            })
            .catch((err:any) => {
              this.presentToast(err, 'danger');
            });
        }
      },
      error: (error: any) => {
        this.presentToast(error, 'danger');
      },
      complete: () => {
        console.log('Observable terminé');
      }
    });
  }
}

addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'pencil-outline' : pencilOutline
});
