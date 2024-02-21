import { Injectable, inject } from '@angular/core';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';
import {Firestore, collection, collectionData, getDocs, addDoc} from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs';
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import CollectionReference = firebase.firestore.CollectionReference;
import "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private readonly firestore = inject(Firestore);
  private topics : Topic [] = [];
  // private topicCollectionRef: CollectionReference;
  //
  // constructor() {
  //   this.topicCollectionRef = collection(this.firestore, 'topics');
  // }

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

  getTopicById(topicId: string): Observable<Topic | undefined> {
    return this.getAllTopics().pipe(
      map(topics => topics.find(topic => topic.id === topicId))
    );
  }

  get(topicId: string): Topic | undefined {
    return this.topics.find(topic => topic.id == topicId);
  }


  getPostsByTopicId(topicId: string) : Observable<Post[] | undefined> {
    return collectionData(collection(this.firestore, 'topics/'+topicId+'/posts')) as Observable<Post[]>;
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

  /**
   * Ajouter un nouveau topic
   * @param topic
   */
  async addTopic(topic: Topic): Promise<void> {
      if (!topic.name && !topic.posts) return;
      const topicCollectionRef = collection(this.firestore, 'topics');

      try {
        await addDoc<DocumentData, DocumentData>(topicCollectionRef, {
          name: topic.name,
        });
      } catch (error) {
        console.error('Error adding document:', error);
      }
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

  /**
   * Ajouter un nouveau post à un topic existant
   * @param post
   * @param topicId
   */
  async addPost(post: Post, topicId: string): Promise<void> {
    if (!post.description && !post.name) return;
    try {
      const postCollectionRef = collection(this.firestore, 'topics/' + topicId + '/posts');
      await addDoc<DocumentData, DocumentData>(postCollectionRef, {
        description: post.description,
        name: post.name,
      });
    } catch (error) {
      console.error('Error adding document:', error);
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
