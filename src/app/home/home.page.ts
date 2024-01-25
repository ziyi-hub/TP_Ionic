import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';
import { ModalController } from '@ionic/angular';
import { TopicModalComponent } from '../components/topic-modal/topic-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  topics: Topic[] = [];
  topic1: Topic = {id: 1, name: "L'amour", posts: []}

  constructor(
    private topicService: TopicService,
    private modalController: ModalController,
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
   * Ouvrir fenetre Modal
   */
  async openModal() {
    const modal = await this.modalController.create({
      component: TopicModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      // console.log(data);
      if (!!data && data.data) {
        // Add the new topic to the list
        const newTopic = { id: 1, name: data.data, posts: [] }
        this.topicService.addTopic(newTopic);
        // Reload the list of topics
        this.loadTopics();
      }
    });

    return await modal.present();
  }

  navigateToDetail(topicId: number) {
    // Naviguer vers la page de détail avec l'id du topic
    this.router.navigate(['/topic-detail', topicId]);
  }

}
