import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, LoadingController} from '@ionic/angular';
import {addIcons} from "ionicons";
import {Router, RouterModule} from '@angular/router';

import {
  lockClosedOutline,
  personOutline,
  chevronForward,
} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {UtilitiesMixin} from "../../mixins/utilities-mixin";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class LoginPage extends UtilitiesMixin{

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+\\-]+@[a-z0-9.\\-]+\\.[a-z]{2,}$")
    ]],
    password: ['', [
      Validators.required,
      Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
    ]]
  })

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    super();
  }

  async login(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if(this.loginForm?.valid){
      this.authService.signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then((res) => {
          this.presentToast("Login succeeded", 'success');
          this.router.navigate(['/home']);
          loading.dismiss();
        })
        .catch((err) => {
          this.presentToast(err + " Login failed", 'danger');
          loading.dismiss();
        })
    }
  }

}

addIcons({
  'lock-closed-outline' : lockClosedOutline,
  'person-outline' : personOutline,
  'chevron-forward' : chevronForward,
});
