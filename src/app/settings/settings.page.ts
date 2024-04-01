import {Component} from '@angular/core';
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
import {AuthService} from "../services/auth.service";
import { TabPage } from '../components/tab/tab.page';
import {addIcons} from "ionicons";
import {logOutOutline} from "ionicons/icons";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonThumbnail,IonCard, IonToggle,IonInput, IonList,IonText,IonIcon, TabPage,IonImg, CommonModule, FormsModule, IonRow, IonCol,IonButton, FormsModule, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem]
})
export class SettingsPage{

  constructor(private authService: AuthService) {}

  async logout() {
    await this.authService.logOut();
  }

}

addIcons({
  'log-out-outline': logOutOutline,
});

