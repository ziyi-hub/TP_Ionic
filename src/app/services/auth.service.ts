import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut, user, User
} from "@angular/fire/auth";
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  connectedUser$ = user(this.auth);
  constructor() {
    this.connectedUser$.subscribe(
      user => {
        if(!user) this.router.navigateByUrl("/login");
        if(user && !user.emailVerified){
          this.sendEmailVerification(user);
          this.logOut();
        }
      }
    )
  }

  async createUser(email: string, password: string){
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async signIn(email: string, password: string):Promise<void>{
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logOut(){
    await signOut(this.auth);
  }

  isAuthenticated(): Observable<User | null>{
    return this.connectedUser$;
  }

  async sendEmailVerification(user: User){
    await sendEmailVerification(user);
  }

  resetPassword(email: string){
    return sendPasswordResetEmail(this.auth, email);
  }

}
