import { defineCustomElement as defineCustomElementModal } from '@ionic/core/components/ion-modal.js';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { defineCustomElement as defineCustomElementLoading} from '@ionic/core/components/ion-loading.js';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone:true,
  styleUrls: ['app.component.scss'],
  imports:[IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor() {
    defineCustomElementLoading();
    defineCustomElementModal();
  }
}
