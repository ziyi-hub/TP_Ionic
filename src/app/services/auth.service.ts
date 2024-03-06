import {inject, Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut, user, User
} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
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
      // .then((userCredential) => {
      //   const user = userCredential.user;
      //   this.sendEmailVerification(user);
      //   this.logOut();
      // })
  }

  async signIn(email: string, password: string){
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logOut(){
    await signOut(this.auth);
  }

  isConnected(): User | null{
    return this.auth.currentUser;
  }

  async sendEmailVerification(user: User){
    await sendEmailVerification(user);
  }

}