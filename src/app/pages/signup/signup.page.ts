import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, LoadingController} from '@ionic/angular';
import {addIcons} from "ionicons";
import {chevronForward, lockClosedOutline, personOutline} from "ionicons/icons";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UtilitiesMixin} from "../../mixins/utilities-mixin";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class SignupPage extends UtilitiesMixin{

  regForm: FormGroup = this.formBuilder.group({
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
    ]],
    confirmPassword: ['', [
      Validators.required,
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.,#';^_")(+=@$!%*?/&<>-])[A-Za-z\d.,#';^_")(+=@$!%*?/&<>-]{4,}$/),
    ]],
  })

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    super();
  }

  get errorControl(){
    return this.regForm?.controls;
  }

  async signUp(){
    const loading = await this.loadingCtrl.create();
    await loading.present();
    if(this.regForm?.valid && this.regForm.value.password === this.regForm.value.confirmPassword){
      this.authService.createUser(this.regForm.value.email, this.regForm.value.password)
        .then((res) => {
          const user = res.user;
          this.authService.sendEmailVerification(user);
          this.authService.logOut();
          this.presentToast("Registration successful.", 'success');
          this.router.navigate(['/login']);
          loading.dismiss();
        })
        .catch((err) => {
          this.presentToast(err, 'danger');
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
