import { Component, Input, OnInit, inject } from '@angular/core';
import { IonBackButton,IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone:true,
  selector: 'app-reset-password-modal',
  templateUrl: './reset-password-modal.component.html',
  styleUrls: ['./reset-password-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonBackButton, IonHeader, IonToolbar, IonItem, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class ResetPasswordModalComponent extends UtilitiesMixin implements OnInit {
  @Input() categoryId: string | undefined;
  private readonly modalCtrl = inject(ModalController);
  resetPasswordForm = new FormGroup({
    email : new FormControl('', [Validators.required]) });
  async ngOnInit(): Promise<void> {
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.resetPasswordForm.value, 'confirm');
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});
