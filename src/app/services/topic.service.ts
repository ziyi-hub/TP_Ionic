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
  async getPost(topicId: string, postId: string) {
    const topic = await this.get(topicId);
    if (topic && topic.posts) {
      return topic.posts.find(post => post.id === postId);
    } else {
      throw new Error('Topic not found or does not contain posts.');
    }
  }
  
  getNameById(topicId: string): string | undefined {
    return this.get(topicId)?.name;
  }

  // Ajouter un nouveau topic
  async addTopic(topic: Topic): Promise<void> {
    this.topics.push(topic);
  }
  
  async updateTopic(topicToUpdate: Topic): Promise<void> {
    const index = this.topics.findIndex(topic => topic.id === topicToUpdate.id);
    if (index !== -1) {
      this.topics[index].name = topicToUpdate.name;
    } else {
      throw new Error('Topic not found');
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    const index = this.topics.findIndex(topic => topic.id === topicId);
    if (index !== -1) {
      this.topics.splice(index, 1);
    } else {
      throw new Error('Topic not found');
    }
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
  async deletePost(postId: string, topicId: string): Promise<void> {
    const topic = this.get(topicId);
    if (topic && topic.posts) {
      const index = topic.posts.findIndex(post => post.id === postId);
      if (index !== -1) {
        topic.posts.splice(index, 1);
      } else {
        throw new Error('Post not found');
      }
    } else {
      throw new Error('Topic not found or has no posts');
    }
  }
  
  async updatePost(updatedPost: Post, topicId: string): Promise<void> {
    const topic = this.get(topicId);
    if (topic && topic.posts) {
      const index = topic.posts.findIndex(post => post.id === updatedPost.id);
      if (index !== -1) {
        topic.posts[index] = updatedPost;
      } else {
        throw new Error('Post not found');
      }
    } else {
      throw new Error('Topic not found or has no posts');
    }
  }
  
}
