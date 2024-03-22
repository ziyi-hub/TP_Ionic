import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut, user, User
} from "@angular/fire/auth";
import {Router} from "@angular/router";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  connectedUser$ = user(this.auth);
  async createUser(email: string, password: string){
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email: string, password: string):Promise<void>{
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logOut(){
    await signOut(this.auth);
  }

  async isAuthenticated(): Promise<Observable<User | null>>{
    return this.connectedUser$;
  }

  async sendEmailVerification(user: User){
    await sendEmailVerification(user);
  }

}
