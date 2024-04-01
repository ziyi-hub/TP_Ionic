import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from "ionicons";
import { checkmarkOutline, chevronForward, lockClosedOutline, personOutline } from "ionicons/icons";
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
  IonCard,
  IonCardSubtitle, 
  IonCardContent,
  LoadingController, ModalController ,
  IonInput, IonIcon } from '@ionic/angular/standalone';
import { UploadService } from 'src/app/services/upload.service';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  standalone: true,
  imports: [IonIcon, IonInput, IonCard,
    IonCardSubtitle, 
    IonCardContent, IonImg, CommonModule, ReactiveFormsModule, FormsModule, IonRow, IonCol,IonButton, ReactiveFormsModule, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem]
})
export class UserModalComponent extends UtilitiesMixin implements OnInit{
  
  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      this.loadUserDetails();
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger");
    }
  }
  private readonly formBuilder = inject(FormBuilder)
  readonly uploadService = inject(UploadService)
  private readonly loadingController = inject(LoadingController)
  private readonly modalController = inject(ModalController);
  userDetailsForm: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
    ]],
    username: ['', [
      Validators.required
    ]],
    firstName: ['', [
      Validators.required
    ]],
    lastName: ['', [
      Validators.required
    ]],
    imgUrl:['', []]
  })
  get errorControl() {
    return this.userDetailsForm?.controls;
  }
  loadUserDetails() {
    try {
      if (this.user) {
        this.userDetailsForm.setValue({
          username:this.user.username,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email  ,
          imgUrl: '',

        });
      }
    } catch (error) {
      const msg = "Error fetching category: " + error;
      this.presentToast(msg, "danger");
    }
  }
  async confirm(file: any, event: Event) {
    event.preventDefault();
    let imgUrl: string | null = null;
    if (file) {
      imgUrl = await this.uploadService.uploadFile(file);
      this.userDetailsForm.patchValue({ imgUrl })
    }
    return this.modalController.dismiss(this.userDetailsForm.value, 'confirm');
  }
  
  cancel() {
    return this.modalController.dismiss(null, 'cancel');
  }


}

addIcons({
  'lock-closed-outline': lockClosedOutline,
  'person-outline': personOutline,
  'chevron-forward': chevronForward,
  'checkmark-outline' : checkmarkOutline
});
