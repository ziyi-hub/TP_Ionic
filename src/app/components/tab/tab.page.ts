import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {addIcons} from "ionicons";
import {homeOutline, searchOutline, settingsOutline} from "ionicons/icons";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-custom-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ]
})
export class TabPage {

  constructor() { }

}

addIcons({
  'settings-outline': settingsOutline,
  'home-outline': homeOutline,
  'search-outline': searchOutline,
});
