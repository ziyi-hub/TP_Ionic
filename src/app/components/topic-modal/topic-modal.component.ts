import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone:true,
  selector: 'app-topic-modal',
  templateUrl: './topic-modal.component.html',
  styleUrls: ['./topic-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonHeader, IonToolbar, IonItem, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class TopicModalComponent {
  
  name = new FormControl('');

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name.value, 'confirm');
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});