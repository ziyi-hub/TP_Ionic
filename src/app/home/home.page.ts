import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { TopicModalComponent } from '../components/topic-modal/topic-modal.component';
import { ModalController, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline} from 'ionicons/icons';
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem],
})

export class HomePage extends UtilitiesMixin implements OnInit {
  topics: Topic[] = [];

  
  private readonly topicService = inject(TopicService);
  private readonly modalController = inject(ModalController);
  private readonly router = inject(Router);
  /**
   * Charger les topics lors de l'initialisation de la page
   */
  ngOnInit() {
    this.loadTopics();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */
  loadTopics() {
    this.topics = this.topicService.getAll();
  }

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
          .then(() => {
            const message =  data.data + " is successfully created."
            this.presentToast(message, 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'danger');
          })
        this.loadTopics();
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
            .then(() => {
              const message = data.data + " is successfully updated."
              this.presentToast(message, 'success');
            })
            .catch((err) => {
              this.presentToast(err, 'danger');
            })
          this.loadTopics();
        
      }
    });

    return await modal.present();
  }
  async deleteTopic(topicId: string){
    const topicName =  this.topicService.get(topicId)?.name;
    this.topicService.deleteTopic(topicId).then(() => {
      const message = topicName + " is succesfully deleted."
      this.presentToast(message,  'success');
    })
    .catch((err) => {
      this.presentToast(err, 'danger');
    });
  }
}

/**
* Add icons
**/
addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'pencil-outline' : pencilOutline
});
