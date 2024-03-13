import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, addDoc, deleteDoc, doc,updateDoc, DocumentData} from '@angular/fire/firestore';
import { Observable, map, BehaviorSubject, switchMap } from 'rxjs';
import  { Topic } from '../models/topic';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})

export class TopicService {
  private bsyTopics$: BehaviorSubject<Topic[]> = new BehaviorSubject<Topic[]>([]);
  private bsyPosts$ : BehaviorSubject<Post[]>  = new BehaviorSubject<Post[]>([]);
  private readonly firestore = inject(Firestore);
  
  /**
   * Retrieve all topics and populate the BehaviorSubject with the data.
   * @returns Observable array of topics
   */
  getAllTopics(): Observable<Topic[]> {
    const topicCollectionRef = collectionData(collection(this.firestore, 'topics'), {idField: 'id'}) as Observable<Topic[]>
    topicCollectionRef.subscribe({
      next: (topics) => this.bsyTopics$.next(topics),
      error: (error) => {throw new Error('Error fetching topics: '+ error)}
    });
    return this.bsyTopics$.asObservable();

  }
  /**
   * Retrieve a topic by its identifier.
   * @param topicId Topic ID
   * @returns Observable of the topic with the specified ID
   */
  getTopicById(topicId: string): Observable<Topic | undefined> {
    return this.getAllTopics().pipe(
      map(topics => topics.find(topic => topic.id === topicId))
    );
  }

  /**
   * Retrieve all posts of a topic and populate the BehaviorSubject with the data.
   * @param topicId Topic ID
   * @returns Observable array of posts for the specified topic
   */
  getPostsByTopicId(topicId: string) : Observable<Post[] | undefined> {
    const postCollectionRef = collectionData(collection(this.firestore, 'topics/'+topicId+'/posts'), {idField:'id'}) as Observable<Post[]>;
    postCollectionRef.subscribe({
      next: (posts) => this.bsyPosts$.next(posts),
      error: (error) => console.error('Error fetching posts:', error)
    });
    return this.bsyPosts$.asObservable();
  }

  /**
   * Retrieve a post by its ID.
   * @param topicId Topic ID
   * @param postId Post ID
   * @returns Observable of the post with the specified ID
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
 * Add a new topic to Firestore.
 * @param topic The topic to add
 * @returns Promise that resolves with the added topic
 * @throws Error if the topic name is not provided
 */
async addTopic(topic: Topic): Promise<Topic> {
  if (!topic.name) throw new Error('Topic name is required');
  const docRef = await addDoc(collection(this.firestore, 'topics'), { name: topic.name });
  return { ...topic, id: docRef.id };
}

/**
 * Update an existing topic in Firestore.
 * @param topicToUpdate The topic to update
 * @returns Promise that resolves with the updated topic
 * @throws Error if the topic ID is not provided
 */
async updateTopic(topicToUpdate: Topic): Promise<Topic> {
  if (!topicToUpdate.id) throw new Error('Topic id is required');
  const topicDocRef = doc(collection(this.firestore, 'topics'), topicToUpdate.id);
  await updateDoc(topicDocRef, { name: topicToUpdate.name });
  return topicToUpdate;
}

/**
 * Delete a topic from Firestore.
 * @param topicId The ID of the topic to delete
 * @returns Promise that resolves with a boolean indicating success
 * @throws Error if the topic ID is not provided
 */
async deleteTopic(topicId: string): Promise<boolean> {
  if (!topicId) throw new Error('Topic id is required');
  const topicDocRef = doc(collection(this.firestore, 'topics'), topicId);
  await deleteDoc(topicDocRef);
  return true;
}

/**
 * Add a new post to a topic in Firestore.
 * @param post The post to add
 * @param topicId The ID of the topic to add the post to
 * @returns Promise that resolves with the added post
 * @throws Error if the post name or description is not provided
 */
async addPost(post: Post, topicId: string): Promise<Post> {
  if (!post.name || !post.description) throw new Error('Post name and description are required');
  const postCollectionRef = collection(this.firestore, `topics/${topicId}/posts`);
  const docRef = await addDoc(postCollectionRef, { name: post.name, description: post.description });
  return { ...post, id: docRef.id };
}

/**
 * Update an existing post in a topic in Firestore.
 * @param updatedPost The post to update
 * @param topicId The ID of the topic containing the post
 * @returns Promise that resolves with the updated post
 * @throws Error if the post ID is not provided
 */
async updatePost(updatedPost: Post, topicId: string): Promise<Post> {
  if (!updatedPost.id) throw new Error('Post id is required');
  const postDocRef = doc(collection(this.firestore, `topics/${topicId}/posts`), updatedPost.id);
  await updateDoc(postDocRef, { name: updatedPost.name, description: updatedPost.description });
  return updatedPost;
}

/**
 * Delete a post from a topic in Firestore.
 * @param postId The ID of the post to delete
 * @param topicId The ID of the topic containing the post
 * @returns Promise that resolves with a boolean indicating success
 * @throws Error if the post ID or topic ID is not provided
 */

/**
 * Delete a post from a topic.
 * @param postId The ID of the post to delete
 * @param topicId The ID of the topic containing the post
 * @returns Promise that resolves with a boolean indicating success
 * @throws Error if the post ID or topic ID is not provided
 */
async deletePost(postId: string, topicId: string): Promise<boolean> {
  if (!postId || !topicId) throw new Error('Post id and topic id are required');
  const postDocRef = doc(collection(this.firestore, `topics/${topicId}/posts`), postId);
  await deleteDoc(postDocRef);
  return true;
}


}
