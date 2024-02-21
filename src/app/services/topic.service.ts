import { Injectable, inject } from '@angular/core';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';
import {Firestore, collection, collectionData, addDoc, deleteDoc, getDoc} from '@angular/fire/firestore';
import { Observable, map, from, BehaviorSubject, switchMap } from 'rxjs';
import firebase from "firebase/compat";
import DocumentData = firebase.firestore.DocumentData;
import "firebase/firestore";
import { doc, updateDoc } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})

export class TopicService {
  private readonly firestore = inject(Firestore);
  private bsyTopics$: BehaviorSubject<Topic[]> = new BehaviorSubject<Topic[]>([]);
  private bsyPosts$ : BehaviorSubject<Post[]>  = new BehaviorSubject<Post[]>([]);

  /**
   * Retrieve all topics.
   */
  getAllTopics(): Observable<Topic[]> {
    const topicCollectionRef = collectionData(collection(this.firestore, 'topics'), {idField: 'id'}) as Observable<Topic[]>
    topicCollectionRef.forEach((value)=>{
      this.bsyTopics$.next(value);
    })
    return this.bsyTopics$.asObservable();

  }
  /**
   * Retrieve a topic by its identifier.
   * @param topicId
   */
  getTopicById(topicId: string): Observable<Topic | undefined> {
    return this.getAllTopics().pipe(
      map(topics => topics.find(topic => topic.id === topicId))
    );
  }

  /**
   * Retrieve all posts from a topic.
   * @param topicId
   */
  getPostsByTopicId(topicId: string) : Observable<Post[] | undefined> {
    const postCollectionRef = collectionData(collection(this.firestore, 'topics/'+topicId+'/posts'), {idField:'id'}) as Observable<Post[]>;
    postCollectionRef.forEach(value=>{
      this.bsyPosts$.next(value);
    })
    return this.bsyPosts$.asObservable();
  }

  /**
   * Retrieve a post from a topic.
   * @param topicId
   * @param postId
   */
  getPost(topicId: string, postId: string): Observable<Post | undefined> {
    return this.getTopicById(topicId).pipe(
      switchMap((topic) => {
        if (topic) {
          return this.getPostsByTopicId(topicId).pipe(
            map(posts => posts!.find(post => post.id === postId))
          );
        } else {
          throw new Error('Topic not found or does not contain posts.');
        }
      })
    );
  }

  /**
   * Add new Topic
   * @param topic
   */
  async addTopic(topic: Topic) {
    return new Promise((resolve, reject) => {
      if (!!topic.name) {
        addDoc<DocumentData, DocumentData>(collection(this.firestore, 'topics'), {name: topic.name})
          .then(() => { resolve(topic) });
      }else{
        reject("Error: name undefined");
      }
    })
  }

  /**
   * Mise à jour un topic
   * @param topicToUpdate
   */
  async updateTopic(topicToUpdate: Topic){
    return new Promise((resolve, reject) => {
      if (this.getTopicById(topicToUpdate.id)) {
        updateDoc(doc(collection(this.firestore, 'topics'), topicToUpdate.id), {name: topicToUpdate.name})
          .then(() => { resolve(topicToUpdate) })
      } else {
        reject("Error: topic not found");
      }
    });
  }

  /**
   * Suppression un topic
   * @param topicId
   */
  async deleteTopic(topicId: string) {
    return new Promise((resolve, reject) => {
      if (!!topicId) {
        const topicToDelete = doc(collection(this.firestore, 'topics'), topicId);
        deleteDoc(topicToDelete).then(() => { resolve( this.getTopicById(topicId) ) })
      }else{
        reject("Error: topic id undefined");
      }
    });
  }

  /**
   * Ajouter un nouveau post à un topic existant
   * @param post
   * @param topicId
   */
  async addPost(post: Post, topicId: string): Promise<Post> {
    return new Promise((resolve, reject) => {
      if (!!post.name && !!post.description) {
        const postCollectionRef = collection(this.firestore, 'topics/' + topicId + '/posts');
        addDoc<DocumentData, DocumentData>(postCollectionRef, {
          description: post.description,
          name: post.name,
        }).then(() => { resolve(post) });
      }else{
        reject("Error: post undefined");
      }
    })
  }

  /**
   * Suppression un post
   * @param postId
   * @param topicId
   */
  async deletePost(postId: string, topicId: string) {
    return new Promise((resolve, reject) => {
      if (!!postId && !!topicId) {
        const postToDelete = doc(collection(this.firestore, 'topics/' + topicId + '/posts'), postId);
        deleteDoc(postToDelete).then(() => { resolve( this.getPost(topicId, postId) ) })
      }else{
        reject("Error: post undefined");
      }
    });
  }

  /**
   * Mise à jour un post
   * @param updatedPost
   * @param topicId
   */
  async updatePost(updatedPost: Post, topicId: string) {
    return new Promise((resolve, reject) => {
      if (this.getTopicById(topicId)) {
        const path = 'topics/'+topicId+'/posts'
        updateDoc(doc(collection(this.firestore, path), updatedPost.id), {
          name: updatedPost.name,
          description : updatedPost.description
        }).then(() => { resolve(updatedPost)})
      } else {
        reject("Error: post not found");
      }
    });
  }

}
