import {inject, Injectable} from '@angular/core';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';
import {collection, collectionChanges, collectionData, Firestore, getDocs} from "@angular/fire/firestore";
import {from, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private topics: Topic[] = [];

  private firestore: Firestore = inject(Firestore);
  topics$: Observable<Topic[]>;

  constructor() {
    // get a reference to the topics collection
    const topicsCollection = collection(this.firestore, 'topics');
    // get documents (data) from the collection using collectionData
    this.topics$ = collectionData(topicsCollection, { idField: 'id'}) as Observable<Topic[]>;

    // this.topics$ = from(
    //   topicsCollection
    //   ).pipe(
    //     map((items) =>
    //       items.map((item) => {
    //         const data = item.doc.data();
    //         const id = item.doc.id;
    //         return {id};
    //       })
    //     )
    //   );
  }

  // Récupérer tous les topics
  getAll(): Observable<Topic[]> {
    return this.topics$;
  }

  getAllTopics(): Observable<Topic[]> {
    const topicCollectionRef = collection(this.firestore, 'topics');
    return from(getDocs(topicCollectionRef)).pipe(
      map(snapshot => {
        const topics: Topic[] = [];
        snapshot.forEach(doc => {
          topics.push({id: doc.id,name: doc.data()['name'],posts: []});
        });
        return topics;
      })
    );
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
