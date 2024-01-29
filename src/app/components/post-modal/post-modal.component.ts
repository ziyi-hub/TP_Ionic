import { Component } from '@angular/core';
import { IonTextarea, IonIcon, IonHeader, IonToolbar, IonTitle,IonItem, IonContent, IonInput, IonButtons, IonButton, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone:true,
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
  imports : [ReactiveFormsModule, IonTextarea, IonIcon, IonItem, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, CommonModule ]
})
export class PostModalComponent {
  post = new FormGroup({
    name : new FormControl(''),
    description : new FormControl('') });

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.post.value, 'confirm');
  } 
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});