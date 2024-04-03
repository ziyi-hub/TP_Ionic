import { Injectable, inject } from '@angular/core';
import { Auth, updateEmail, User, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, UserCredential, deleteUser, sendPasswordResetEmail, signInWithCredential, user, GoogleAuthProvider, onAuthStateChanged, AuthCredential } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { GoogleAuth, User as UserCapacitor} from '@codetrix-studio/capacitor-google-auth';
import { updatePassword } from 'firebase/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly auth  = inject(Auth);
  private readonly router  = inject(Router);
  private readonly usersService = inject(UsersService);
  private connectedUserSubject : BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    this.auth.onAuthStateChanged(user => {
      this.connectedUserSubject.next(user);
    });
  }

  public getConnectedUser(): Observable<User | null> {
    return this.connectedUserSubject.asObservable();
  }

  public async createUser(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.sendEmailVerification(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  public async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }
  public async logOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']); 
    } catch (error) {
      throw error;
    }
  }
  public async signInWithGoogle(user : UserCapacitor): Promise<UserCredential> {
    const credential = GoogleAuthProvider.credential(user.authentication.idToken);
    return await signInWithCredential(this.auth, credential);
  }


  public async signUpWithGoogle(): Promise<UserCapacitor| null> {
    return await GoogleAuth.signIn();
  }

  public async isAuthenticated(): Promise<boolean> {
    const user = this.auth.currentUser;
    return !!user;
  }

  public async sendEmailVerification(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
    } catch (error) {
      throw error;
    }
  }

  public async deleteAccount(user: User): Promise<void> {
    try {
      const userToDelete = await this.usersService.deleteUser(user.uid);
      if (userToDelete) 
        await deleteUser(user); 
    } catch (error) {
      throw error;
    }
  }
  public async updateEmail(user:User, newEmail:string) : Promise<void>{
    await updateEmail(user, newEmail)
  }
  public async updatePassword(user:User, newPassword:string) : Promise<void>{
    await updatePassword(user, newPassword)
  }

  public async resetPassword(email: string) : Promise<void>{
    return sendPasswordResetEmail(this.auth, email);
  }

}
