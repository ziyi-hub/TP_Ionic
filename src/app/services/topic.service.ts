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
  get(topicId: string): Topic | undefined {
    return this.topics.find(topic => topic.id == topicId);
  }

  getNameById(topicId: string): string | undefined {
    return this.get(topicId)?.name;
  }

  // Ajouter un nouveau topic
  async addTopic(topic: Topic): Promise<void> {
    await this.topics.push(topic);
  }

  // Ajouter un nouveau post à un topic existant
  async addPost(post: Post, topicId: string): Promise<void> {
    const topic = this.get(topicId);
    if (topic) {
      if (!topic.posts) {
        topic.posts = [];
      }
      topic.posts.push(post);
    }
  }
}
