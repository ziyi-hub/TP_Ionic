import {Component, OnInit, inject} from '@angular/core';
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

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    super();
  }
  ngOnInit(): void {
    const isAuthenticatedSubscription = this.authService.isAuthenticated().subscribe({
      next: (value: any) => {
        if (!!value && value.auth && !!value.auth.currentUser) {
          this.router.navigateByUrl('/');
        }
        isAuthenticatedSubscription.unsubscribe(); 
      },
      error: (error: any) => {
        console.error(error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
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
