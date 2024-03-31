import { AuthService } from './../services/auth.service';
import { Component, inject } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular/standalone";
import {Observable, Subscription, first, switchMap } from "rxjs";
import { User } from "../models/user";
import { UsersService } from '../services/users.service';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  template: ''
})
export class UtilitiesMixin {

  private readonly toastController =  inject(ToastController);
  private readonly alertController =  inject(AlertController);
  user : User | undefined;
  readonly usersService = inject(UsersService);
  readonly authService = inject(AuthService)
  readonly router = inject(Router);

  /**
   * show toast
   * @param message
   * @param color
   */
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: color
    });
    await toast.present();
  }

  /**
   * show a confirm alert before delete
   * @param deleteCallback
   * @param categoryId
   * @param categoryName
   */
  async presentAlertDelete(deleteCallback: (categoryId: string) => void, categoryId: string, categoryName: string) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete ' + categoryName + "?",
      subHeader: '',
      message: '',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            deleteCallback(categoryId);
          },
        },
      ],
    });

    await alert.present();
}
async getCurrentUser(): Promise<User | undefined> {
  try {
    const user = await this.authService.getConnectedUser().pipe(first()).toPromise();

    if (user) {
      const value = await this.usersService.getUserById(user.uid).pipe(first()).toPromise();
      if (value) {
        this.user = value;
        return value;
      }
    }
    return undefined;
  } catch (error) {
    console.log('Error retrieving username:', error);
    throw error;
  }
}



async loadUser(){  
  this.authService.getConnectedUser().subscribe(
    async user => {
      if(!user)
        this.router.navigateByUrl("/login");
      else if(user && !user.emailVerified){
        this.router.navigateByUrl("/login");
      }else if(user){
        const value = await this.usersService.getUserById(user.uid).pipe(first()).toPromise();
        if (value) {
          this.user = value;
          this.router.navigateByUrl("/tab/home");
        }
      }
      
    }
  )
}



}
