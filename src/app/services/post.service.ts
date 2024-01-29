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
  get(postId: string): Post | undefined {
    return this.posts.find(post => post.id == postId);
  }

  // Ajouter un nouveau post
  async addPost(post: Post): Promise<void> {
    await this.posts.push(post);
  }

}
