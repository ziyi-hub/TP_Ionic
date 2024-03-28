import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {AuthService} from "../services/auth.service";
import { TabPage } from '../components/tab/tab.page';
import {addIcons} from "ionicons";
import {logOutOutline} from "ionicons/icons";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabPage
  ]
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

