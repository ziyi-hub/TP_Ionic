import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { TopicModalComponent } from '../components/topic-modal/topic-modal.component';
import { ModalController, ToastController, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline} from 'ionicons/icons';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ IonFab, IonFabButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem],
})

export class HomePage implements OnInit {
  topics: Topic[] = [];
  // topic1: Topic = {id: 1, name: "L'amour", posts: []}

  /**
   * Constructeur
   * @param topicService
   * @param modalController
   * @param toastController
   * @param router
   */
  
  constructor(
    private topicService: TopicService,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
  ) {}

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
  async openModal() {
    const modal = await this.modalController.create({
      component: TopicModalComponent,
    });

    modal.onWillDismiss().then((data) => {
      if (!!data && data.data) {
        const newTopic = { id: 2, name: data.data, posts: [] }
        this.topicService.addTopic(newTopic)
          .then(() => {
            this.presentToast(data.data, 'bottom', 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'bottom', 'danger');
          })
        this.loadTopics();
      }
    });

    return await modal.present();
  }

  /**
   * Show toast
   * @param nameTopic
   * @param position
   * @param color
   */
  async presentToast(nameTopic: string, position: 'bottom', color: string) {
    const toast = await this.toastController.create({
      message: 'Topic ' + nameTopic + " successfully created",
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }

  /**
   * Redirect page
   * @param topicId
   */
  navigateToDetail(topicId: number) {
    this.router.navigate(['/topic-detail', topicId]);
  }

}
/**
* Add icons 
**/
addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline
});
