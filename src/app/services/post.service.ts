import { Injectable } from '@angular/core';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];

  constructor() { }

  // Récupérer tous les posts
  getAll(): Post[] {
    return this.posts;
  }

  // Récupérer un post par ID
  get(postId: number): Post | undefined {
    return this.posts.find(post => post.id == postId);
  }

  // Ajouter un nouveau post
  addPost(post: Post): void {
    this.posts.push(post);
  }

}
