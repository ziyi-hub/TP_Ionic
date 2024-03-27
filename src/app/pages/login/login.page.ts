import { sendPasswordResetEmail } from '@angular/fire/auth';
import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, LoadingController, ModalController} from '@ionic/angular';
import {addIcons} from "ionicons";
import {RouterModule} from '@angular/router';
import { ResetPasswordModalComponent } from 'src/app/components/reset-password-modal/reset-password-modal.component';

import {
  lockClosedOutline,
  personOutline,
  chevronForward,
} from "ionicons/icons";
import {UtilitiesMixin} from "../../mixins/utilities-mixin";
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class LoginPage extends UtilitiesMixin implements OnInit{
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
  private readonly modalController = inject(ModalController)
  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    super();
  }
  ngOnInit() {
    this.loadUser()
  }

  async login() {
    if (this.loginForm?.valid) {
      try {
        await this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password);
        this.authService.getConnectedUser().pipe(first()).subscribe(async (user) => {
          if (user && user.emailVerified) {
            this.presentToast("Login succeeded", 'success');
            this.router.navigate(['/tab/home']);
          } else if (user && !user.emailVerified) {
            this.presentToast("Please verify your email before logging in", 'danger');
            await this.authService.logOut(); 
          } else {
            this.presentToast("Login failed", 'danger');
          }
        });
      } catch (err) {
        this.presentToast("Login failed", 'danger');
      }
    } else {
        this.presentToast("Login failed", 'danger');
    }
  }
  async resetPassword() {
    const modal = await this.modalController.create({
      component: ResetPasswordModalComponent,
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data) {
        this.authService.resetPassword(data.data.email)
          .then(() => {   
              this.presentToast("Email reset link successfully sent.", 'success');
          })
          .catch((err) => {
            this.presentToast("An error occured, try again." + err, 'danger');
          });
      }
    });
    return await modal.present();
  } 
}

addIcons({
  'lock-closed-outline' : lockClosedOutline,
  'person-outline' : personOutline,
  'chevron-forward' : chevronForward,
});
