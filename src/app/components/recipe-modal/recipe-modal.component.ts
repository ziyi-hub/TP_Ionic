import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IonBackButton,IonTextarea, IonIcon, IonHeader, IonToolbar, IonTitle,IonItem, IonContent, IonInput, IonButtons, IonButton, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from 'src/app/models/recipe';
import { CategoryService } from 'src/app/services/category.service';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { first } from 'rxjs';

@Component({
  standalone:true,
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
  imports : [ReactiveFormsModule, IonBackButton,IonTextarea, IonIcon, IonItem, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, CommonModule ]
})
export class RecipeModalComponent extends UtilitiesMixin implements OnInit{
  @Input() recipeId : string |undefined;
  @Input() categoryId : string |undefined;
  recipe : Recipe | undefined ;
  recipeForm = new FormGroup({
    name : new FormControl('', [Validators.required]) ,
    description : new FormControl('', [Validators.required])});

  private readonly CategoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);
  
  async ngOnInit() {
    try {
      this.username = await this.getCurrentUserName();
      if(this.username)
        this.loadRecipe()
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }
  loadRecipe(){
    try {
      if (this.recipeId && this.categoryId && this.username) {
        this.CategoryService.getRecipe(this.categoryId, this.recipeId, this.username).pipe(first()).subscribe({
          next: (value: any) => {
            if (value && value.description) {
              this.recipeForm.setValue({
                name: value!.name,
                description : value!.description
              });
            }
          },
          error: (error: any) => {
            this.presentToast(error, 'danger');
          },
          complete: () => {
            console.log('Observable terminé');
          }
        });
      }
    } catch (error) {
      const msg =  'Error fetching recipe: '+error
      this.presentToast(msg, 'danger')
    }
    
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.recipeForm.value, 'confirm');
  } 
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});

