import { Component, OnInit, inject, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonItem,
  IonButton,
  IonRow,
  IonCol,
  IonImg,
  IonIcon,
  IonToggle,
  IonInput,
  IonList,
  IonText,
  IonThumbnail,
  IonCard,
  ActionSheetController, ModalController

} from '@ionic/angular/standalone';
import { TabPage } from '../components/tab/tab.page';
import {addIcons} from "ionicons";
import {ellipsisVertical, logOutOutline} from "ionicons/icons";
import { UtilitiesMixin } from '../mixins/utilities-mixin';
import { UserModalComponent } from '../components/user-modal/user-modal.component';
import { User as UserFirebase } from '../models/user';
import { first } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonThumbnail,IonCard, IonToggle,IonInput, IonList,IonText,IonIcon, TabPage,IonImg, CommonModule, FormsModule, IonRow, IonCol,IonButton, FormsModule, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem]
})
export class SettingsPage extends UtilitiesMixin implements OnInit{
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly modalController = inject(ModalController)
  showButton = false;
  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger");
    }
  }
  async logout() {
    await this.authService.logOut().then(()=>{
      this.presentToast("User succesfully logged out.", "success");
    });
  }
  async updateUser() {
    try {
      const modal = await this.modalController.create({
        component: UserModalComponent,
      });

      await modal.present();
      const { data } = await modal.onWillDismiss();
      if (data && this.user && this.user.id) {
        const userToUpdate: UserFirebase = {
          id: this.user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          imgUrl: data.imgUrl || this.user.imgUrl,
        };
        // // Update email if it's changed
        // const currentAccount = await this.authService.getConnectedUser().pipe(first()).toPromise();
        // if (currentAccount && this.user.email !== data.email) {
        //   await this.authService.updateEmail(currentAccount, data.email);
        //   await this.authService.sendEmailVerification(currentAccount);
        //   await this.logout()
        // }

        // Update user details
        await this.usersService.updateUser(userToUpdate);
        this.getCurrentUser();
        this.presentToast(`${userToUpdate.username} is successfully updated.`, 'success');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      this.presentToast('Failed to update user.', 'danger');
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.updateUser();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async deleteUser() : Promise<Boolean> {
    try {
      const account = await this.authService.getConnectedUser().pipe(first()).toPromise();
      if (account) {
        await this.authService.deleteAccount(account).then(()=>{
          this.presentToast('Account deleted.', 'success');
          this.loadUser()
        })
        return true;
      }
      return false;
    } catch (error) {
      this.presentToast('Failed to delete account.', 'danger');
      throw new Error('Failed to delete account.');
    }
  }


}
addIcons({
  'log-out-outline': logOutOutline,
  'ellipsis-vertical': ellipsisVertical
});

