import {Component, inject, OnInit} from '@angular/core';
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

} from '@ionic/angular/standalone';
import { TabPage } from '../components/tab/tab.page';
import {addIcons} from "ionicons";
import {logOutOutline, refreshOutline, trashOutline} from "ionicons/icons";
import {Recipe} from "../models/recipe";
import {User} from "../models/user";
import {UtilitiesMixin} from "../mixins/utilities-mixin";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonThumbnail,IonCard, IonToggle,IonInput, IonList,IonText,IonIcon, TabPage,IonImg, CommonModule, FormsModule, IonRow, IonCol,IonButton, FormsModule, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem]
})
export class SettingsPage extends UtilitiesMixin implements OnInit{
  recipe : Recipe  | undefined ;
  categoryId : string | undefined ;
  users : User[] | undefined;

  constructor() {
    super();
  }

  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  async logout() {
    await this.authService.logOut();
  }

}

addIcons({
  'log-out-outline': logOutOutline,
  'trash-outline' : trashOutline,
  'refresh-outline': refreshOutline,
});

