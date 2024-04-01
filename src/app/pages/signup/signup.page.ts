import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { addIcons } from "ionicons";
import { chevronForward, lockClosedOutline, personOutline } from "ionicons/icons";
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
  IonInput
} from '@ionic/angular/standalone';
import { RouterModule } from "@angular/router";
import { UtilitiesMixin } from "../../mixins/utilities-mixin";
import { User } from 'src/app/models/user';
import { UploadService } from 'src/app/services/upload.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonInput, IonCard,
    IonCardSubtitle, 
    IonCardContent, IonImg, CommonModule,RouterModule, ReactiveFormsModule, FormsModule, IonRow, IonCol,IonButton, ReactiveFormsModule, IonButton, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem]
})
export class SignupPage extends UtilitiesMixin {
  private readonly formBuilder = inject(FormBuilder)
  readonly uploadService = inject(UploadService)
  private readonly loadingController = inject(LoadingController)
  regForm: FormGroup = this.formBuilder.group({
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
    password: ['', [
      Validators.required,
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,#';^_")(+=@$!%*?/&<>-])[A-Za-z\d.,#';^_")(+=@$!%*?/&<>-]{4,}$/),
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,#';^_")(+=@$!%*?/&<>-])[A-Za-z\d.,#';^_")(+=@$!%*?/&<>-]{4,}$/),
    ]],
  })
  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp(imgUrl : string) {
    try {
      if (!this.regForm?.valid) {
        throw new Error('Form is invalid.');
      }
      const { email, password, confirmPassword, username, lastName, firstName } = this.regForm.value;
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      if (!username) {
        throw new Error('Username is required.');
      }
      const account = await this.authService.createUser(email, password);
      await this.authService.logOut();
      const userValue : User = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        imgUrl : imgUrl
      };
      await this.usersService.addUser(userValue, account.user.uid)
    } catch (error) {
      this.presentToast(error+"", 'danger');
    }
  }
  async addFile(file: any, event: Event) {
    event.preventDefault();
    const loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    await loading.present();
    try {
      const imgUrl= await this.uploadService.uploadFile(file)
      if(imgUrl){
        await this.signUp(imgUrl).then(()=>{
          this.presentToast('Registration successfull, please validate your email address.', 'success');
        }).catch(()=>{
          this.presentToast("Failed to register user", 'danger');
        });
      }else{
        this.presentToast("Failed to register user", 'danger');
      }
      await loading.dismiss();
      this.regForm.reset();
    } catch {
      await loading.dismiss();
      this.presentToast("Failed to register user", 'danger');
    }
    this.router.navigate(['/login']);
  }

}

addIcons({
  'lock-closed-outline': lockClosedOutline,
  'person-outline': personOutline,
  'chevron-forward': chevronForward,
});
