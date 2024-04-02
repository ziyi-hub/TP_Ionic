import { Injectable, inject } from '@angular/core';
import {Firestore, collection, collectionData, deleteDoc, doc,updateDoc, setDoc, query, or, where} from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import  { User } from '../models/user';
import { serverTimestamp } from 'firebase/firestore';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private readonly firestore = inject(Firestore);
  
  /**
   * Retrieve all users and populate the BehaviorSubject with the data.
   * @returns Observable array of users
   */
  getAllUsers(): Observable<User[]> {
    return collectionData(collection(this.firestore, 'users'), {idField: 'id'}) as Observable<User[]>

  }
  
  /**
   * Retrieve a user by its identifier.
   * @param userId user ID
   * @returns Observable of the user with the specified ID
   */
  getUserById(userId: string): Observable<User | undefined> {
    return (collectionData(collection(this.firestore, 'users'), {idField: 'id'}) as Observable<User[]>).pipe(
      map(users => users.find(user => user.id === userId))
    );
  }
  

  /**
 * Add a new user to Firestore.
 * @param user The user to add
 * @param docId The Id of the linked account
 * @returns Promise that resolves with the added user
 * @throws Error if the user name is not provided
 */
async addUser(user: User, docId: string): Promise<User> {
  if (!user.username) throw new Error('A username is required');
  if (!user.firstName) throw new Error('A firstname is required');
  if (!user.lastName) throw new Error('A lastname is required');
  const userValue = { 
    username: user.username,
    firstName : user.firstName,
    lastName: user.lastName,
    imgUrl : user.imgUrl || "",
    createdAt : serverTimestamp(),
    updatedAt : serverTimestamp(),
  };
  const userDocRef = doc(this.firestore, 'users', docId);
  try {
      await setDoc(userDocRef, userValue);
  } catch (error) {
      console.error("Error adding user:", error);
      throw error;
  }
  return { ...user, id: docId }; 
}

/**
 * Update an existing user in Firestore.
 * @param userToUpdate The user to update
 * @returns Promise that resolves with the updated user
 * @throws Error if the user ID is not provided
 */
async updateUser(userToUpdate: User): Promise<User> {
  if (!userToUpdate.id) throw new Error('user id is required');
  const userDocRef = doc(collection(this.firestore, 'users'), userToUpdate.id);
  const userValue = { 
    username: userToUpdate.username,
    firstName : userToUpdate.firstName,
    lastName: userToUpdate.lastName,
    imgUrl : userToUpdate.imgUrl ,
    updatedAt : serverTimestamp(), 
  };
  await updateDoc(userDocRef, userValue);
  return userToUpdate;
}

/**
 * Delete a user from Firestore.
 * @param userId The ID of the user to delete
 * @returns Promise that resolves with a boolean indicating success
 * @throws Error if the user ID is not provided
 */
async deleteUser(userId: string): Promise<boolean> {
  if (!userId) throw new Error('user id is required');
  const userDocRef = doc(collection(this.firestore, 'users'), userId);
  await deleteDoc(userDocRef);
  return true;
}

}
