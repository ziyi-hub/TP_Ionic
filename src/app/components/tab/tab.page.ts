import { Component } from '@angular/core';
import {addIcons} from "ionicons";
import {homeOutline, searchOutline, settingsOutline} from "ionicons/icons";
import { IonTabButton, IonTabBar, IonTabs, IonIcon, IonLabel} from '@ionic/angular/standalone';
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-custom-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
  standalone: true,
  imports: [
    IonTabButton,
    IonTabBar,
    IonTabs,
    IonIcon,
    IonLabel
  ]
})
export class TabPage {
  showSearchBar: boolean = false;

  constructor(private searchService: SearchService) { }

  toggleSearchBar() {
    this.searchService.toggleSearchBar();
  }
}

addIcons({
  'settings-outline': settingsOutline,
  'home-outline': homeOutline,
  'search-outline': searchOutline,
});
