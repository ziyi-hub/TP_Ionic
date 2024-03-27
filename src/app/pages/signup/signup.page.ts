import { UsersService } from './../../services/users.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController } from '@ionic/angular';
import { addIcons } from "ionicons";
import { chevronForward, lockClosedOutline, personOutline } from "ionicons/icons";
import { Router, RouterModule } from "@angular/router";
import { UtilitiesMixin } from "../../mixins/utilities-mixin";
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class SignupPage extends UtilitiesMixin {

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

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
    super();
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  // async signUp(){
  //   // const loading = await this.loadingCtrl.create();
  //   // await loading.present();
  //   if(this.regForm?.valid && this.regForm.value.password === this.regForm.value.confirmPassword && this.regForm.value.username){
  //     this.authService.createUser(this.regForm.value.email, this.regForm.value.password)
  //       .then((account) => {
  //         this.usersService.addUser({id: account.user.uid , username : this.regForm.value.username},account.user.uid).then(()=>{
  //         this.authService.sendEmailVerification(account.user);
  //         this.authService.logOut();
  //         this.presentToast("Registration successful.", 'success');
  //         this.router.navigate(['/login']);
  //         // loading.dismiss();
  //         })
  //         .catch((err) => {
  //           this.presentToast(err, 'danger');
  //           // loading.dismiss();
  //         })

  //       })
  //       .catch((err) => {
  //         this.presentToast(err, 'danger');
  //         // loading.dismiss();
  //       })
  //   }
  // }

  async signUp() {
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
        lastName: lastName
      };
      await this.usersService.addUser(userValue, account.user.uid)
      this.presentToast('Registration successfull, please validate your email address.', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      this.presentToast(error+"", 'danger');
    }
  }

}

addIcons({
  'lock-closed-outline': lockClosedOutline,
  'person-outline': personOutline,
  'chevron-forward': chevronForward,
});
