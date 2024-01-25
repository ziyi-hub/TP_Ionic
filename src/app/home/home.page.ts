import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { Topic } from '../models/topic';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  topics: Topic[] = [];
  topic1: Topic = {id: 1, name: "L'amour", posts: []}

  constructor(private topicService: TopicService) {}

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
    this.topicService.addTopic(this.topic1);
    this.topics = this.topicService.getAll();
  }

}
