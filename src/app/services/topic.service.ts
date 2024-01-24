import { Injectable } from '@angular/core';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  constructor(private topics: Topic[]) {}

  // Récupérer tous les sujets
  getAll(): Topic[] {
    return this.topics;
  }

  // Récupérer un sujet par ID
  get(topicId: number): Topic | undefined {
    return this.topics.find(topic => topic.id == topicId);
  }

  // Ajouter un nouveau sujet
  addTopic(topic: Topic): void {
    this.topics.push(topic);
  }

  // Ajouter un nouveau post à un sujet existant
  addPost(post: Post, topicId: number): void {
    const topic = this.get(topicId);
    if (!!topic) {
      if (!topic.posts) {
        topic.posts = [];
      }
      topic.posts.push(post);
    }
  }
}
