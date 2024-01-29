import { Injectable } from '@angular/core';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private topics: Topic[] = [];

  constructor() {}

  // Récupérer tous les topics
  getAll(): Topic[] {
    return this.topics;
  }

  // Récupérer un sujet par id
  get(topicId: number): Topic | undefined {
    return this.topics.find(topic => topic.id == topicId);
  }

  getNameById(topicId: number): string | undefined {
    return this.get(topicId)?.name;
  }

  // Ajouter un nouveau topic
  async addTopic(topic: Topic): Promise<void> {
    await this.topics.push(topic);
  }

  // Ajouter un nouveau post à un topic existant
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
