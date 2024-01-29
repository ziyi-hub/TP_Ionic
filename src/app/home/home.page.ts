import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import {ModalController, ToastController} from '@ionic/angular';
import { TopicModalComponent } from '../components/topic-modal/topic-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  topics: Topic[] = [];
  topic1: Topic = {id: 1, name: "L'amour", posts: []}

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
    this.topicService.addTopic(this.topic1);
    this.loadTopics();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */
  loadTopics() {
    this.topics = this.topicService.getAll();
  }

  /**
   * Ouvert Modal Topic
   */
  async openModal() {
    const modal = await this.modalController.create({
      component: TopicModalComponent,
    });

    modal.onWillDismiss().then((data) => {
      // console.log(data);
      if (!!data && data.data) {
        // Add the new topic to the list
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
    // Naviguer vers la page de détail avec l'id du topic
    this.router.navigate(['/topic-detail', topicId]);
  }

}
