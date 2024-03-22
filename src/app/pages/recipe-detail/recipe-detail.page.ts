import { CategoryService } from 'src/app/services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/models/recipe';
import { addIcons } from 'ionicons';
import { caretBack } from 'ionicons/icons';
import { first } from 'rxjs';
import { User } from 'src/app/models/user';
import { user } from '@angular/fire/auth';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class RecipeDetailPage extends UtilitiesMixin implements OnInit {
  
  
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  recipe : Recipe  | undefined ;
  categoryId : string | undefined ;
  users : User[] | undefined;
  userForm = new FormGroup({
    username : new FormControl('', [Validators.required]) ,
    role : new FormControl('', [Validators.required]) ,
  }); 
  roles: string[] =['editors','readers']; 
  async ngOnInit() {
    try {
      this.username = await this.getCurrentUserName();
      if (this.username){
        this.getCurrentRecipe()
        this.getUsers()
      }
      
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
    
  }
  getCurrentRecipe(){
    this.route.params.pipe(first()).subscribe(params => {
      this.categoryId = params['categoryId'];
      const recipeId = params['id'];
      
      if(this.username && recipeId)
        this.categoryService.getRecipe(this.categoryId!, recipeId, this.username).pipe(first()).subscribe(
          recipe => {
            if(recipe){
              this.recipe = recipe;
            }
          });
      }
    );

  }
  getUsers(){
    if(this.username)
      this.usersService.getAllUsers().pipe(first()).subscribe(
        users => {
          if(users){
            this.users = users;
          }
        });
  }
  shareRecipe(){
    if (this.categoryId && this.recipe && this.userForm.valid) {
      const { role, username } = this.userForm.value;
      
      if (username) { // Ensure username is not empty
        if (role === "editors") {
          this.recipe.editors = [...(this.recipe.editors || []), username] as string[];
        } else if (role === "readers") {
          this.recipe.readers = [...(this.recipe.readers || []), username] as string[];
        }
        console.log(this.recipe);
        this.categoryService.updateRecipe(this.recipe, this.categoryId).then((value)=>{
          if(value)
            this.presentToast('recipe successfully shared', 'success')
        });
      }
    }
    
    
  }
}

addIcons({
  'caret-back': caretBack
});

