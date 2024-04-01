import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimationController, LoadingController } from '@ionic/angular/standalone';
import { IonInput, IonTitle, IonButton, IonCol, IonButtons, IonContent, IonHeader, IonToolbar, IonIcon, IonItem, IonRow, IonModal, IonList, IonLabel, IonText } from '@ionic/angular/standalone'
import { addIcons } from "ionicons";
import { RouterModule } from '@angular/router';
import { UtilitiesMixin } from "../../mixins/utilities-mixin";
import { User as UserCapacitor } from '@codetrix-studio/capacitor-google-auth';

import { first } from 'rxjs';
import {
  lockClosedOutline,
  personOutline,
  chevronForward,
  mailOutline,
} from "ionicons/icons";
import { User } from 'src/app/models/user';
import { UserCredential, user } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonInput, IonButton, IonCol, IonButtons, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonRow, IonLabel, CommonModule, RouterModule, ReactiveFormsModule, IonModal, IonList, IonItem]
})
export class LoginPage extends UtilitiesMixin implements OnInit {
  private readonly formBuilder = inject(FormBuilder)
  private readonly loadingCtrl = inject(LoadingController)
  private readonly loadingController = inject(LoadingController)
  private readonly animationCtrl = inject(AnimationController)
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
    ]],
    password: ['', [
      Validators.required,
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,#';^_")(+=@$!%*?/&<>-])[A-Za-z\d.,#';^_")(+=@$!%*?/&<>-]{4,}$/),
    ]]
  })
  resetPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
    ]]
  })

  async ngOnInit() {
    await this.loadUser()
  }
  async login() {
    if (this.loginForm?.valid) {
      const loading = await this.loadingController.create({
        message: 'Logging in...'
      });
      await loading.present();
      try {
        await this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
        this.authService.getConnectedUser().pipe(first()).subscribe(async (user) => {
          if (user && user.emailVerified) {
            this.router.navigate(['/tab/home']);
          } else if (user && !user.emailVerified) {
            this.presentToast("Please verify your email before logging in", 'danger');
            await this.authService.logOut();
          } else {
            this.presentToast("Login failed", 'danger');
          }
          await loading.dismiss();
        });
      } catch {
        this.presentToast("Login failed ", 'danger');
        await loading.dismiss();
      }
    } else {
      this.presentToast("Login failed", 'danger');
    }
  }
  async verifyUserGoogle(user: UserCredential, userCapacitor: UserCapacitor) {
    try {
      await this.usersService.getUserById(user.user.uid).pipe(first()).toPromise().then(async (value) => {
        if (!value) {
          const userValue: User = {
            username: userCapacitor.givenName,
            firstName: userCapacitor.givenName,
            lastName: userCapacitor.familyName,
            imgUrl: userCapacitor.imageUrl
          };
          await this.usersService.addUser(userValue, user.user.uid).then((value) => {
            if (value) {
              this.router.navigate(['/tab/home']);
            }
          }).catch(()=>{
            this.presentToast("Failed to login, try again", "danger");
            this.router.navigate(['/login']);
          });
        } else {
          this.router.navigate(['/tab/home']);
        }
      });
    } catch (error) {
      const msg = "Error verifying user: " + error;
      this.presentToast(msg, "danger");
    }
  }
  async loginWithGoogle() {
    try {
        const userCapacitor = await this.authService.signUpWithGoogle();
        if (userCapacitor) {
            await this.authService.signInWithGoogle(userCapacitor).then((value)=>{
              if(value)
                this.verifyUserGoogle(value, userCapacitor)
            });
        }
    } catch (error) {
        this.presentToast("Login failed", 'danger');
    }
  }

  async resetPassword() {
    if (this.resetPasswordForm?.valid && this.resetPasswordForm.value.email) {
      await this.authService.resetPassword(this.resetPasswordForm.value.email)
        .then(() => {
          this.presentToast("Email reset link successfully sent.", 'success');
          this.router.navigateByUrl("/login")
        })
        .catch((err) => {
          this.presentToast("An error occured, try again." + err, 'danger');
          this.router.navigateByUrl("/login")
        });
    }
    this.resetPasswordForm.reset();
  }
}

addIcons({
  'lock-closed-outline': lockClosedOutline,
  'person-outline': personOutline,
  'chevron-forward': chevronForward,
  'mail-outline': mailOutline
});
