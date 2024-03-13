import {inject, Injectable} from '@angular/core';
import {
  Auth,
  authState,
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
  user$ = authState(this.auth);
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

  async signIn(email: string, password: string){
    return await signInWithEmailAndPassword(this.auth, email, password)
    .catch((err)=>{throw new Error('login failed '+err)});
  }

  async logOut(){
    await signOut(this.auth);
  }

  isAuthenticated(): Observable<User | null>{
    return this.user$;
  }

  async sendEmailVerification(user: User){
    await sendEmailVerification(user);
  }

}
