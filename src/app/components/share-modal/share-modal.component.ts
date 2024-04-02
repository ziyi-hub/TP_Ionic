import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule, Validators } from '@angular/forms';
import {ModalController, IonToolbar, IonTitle, IonContent, IonHeader, IonItem, IonSelect, IonSelectOption, IonIcon, IonButton, IonButtons, IonAvatar, IonLabel, IonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBackOutline, caretBack, checkmarkOutline } from 'ionicons/icons';
import { first } from 'rxjs';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { User } from 'src/app/models/user';
import { CommonModule } from '@angular/common';
import { Recipe } from 'src/app/models/recipe';
@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
  standalone: true,
  imports:[IonText, IonLabel,IonAvatar,CommonModule,ReactiveFormsModule,IonToolbar,IonTitle, IonContent,IonHeader, IonItem, IonSelect, IonSelectOption, IonIcon, IonButton, IonButtons]
})
export class ShareModalComponent  extends UtilitiesMixin implements OnInit {
  @Input() recipe : Recipe |undefined;
  @Input() categoryId : string |undefined;
  private readonly modalController = inject(ModalController)
  userForm = new FormGroup({
    user : new FormControl('', [Validators.required]) ,
    role : new FormControl('', [Validators.required]) 
  });
  users: User[] | undefined;
  usersNotShared: User[] | undefined;
  roles: string[] =['editors','readers'];

  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      if (this.user) {
        this.usersNotShared = await this.getUsersNotShared()
      }
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }
  async getUsers() {
    if (this.user && this.categoryId) {
      try {
        const users = await this.usersService.getAllUsers().pipe(first()).toPromise();
        if (users) {
          this.users = users;
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }
  async getUsersNotShared() : Promise<User[]> {
    await this.getUsers();
    if (this.categoryId && this.users && this.recipe && this.user) {
      const editors = this.recipe.editors || [];
      const readers = this.recipe.readers || [];
  
      return this.users.filter(user => {
        if (user && user.id && this.recipe) {
          return !editors.includes(user.id) && !readers.includes(user.id) && this.recipe.owner !== user.id;
        }
        return false;
      });

    } else {
      return [];
    }
  }
  
  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalController.dismiss(this.userForm.value, 'confirm');
  }
}
addIcons({
  'caret-back': caretBack,
  'arrow-back-outline' : arrowBackOutline,
  'checkmark-outline': checkmarkOutline
});
