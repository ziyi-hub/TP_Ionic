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
import { Category } from 'src/app/models/category';

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
  steps: string[] = [
    "Check for a free puppy",
    "Check for a free puppy",
    "Check for a free puppy",
    "Check for a free puppy",
    "Check for a free puppy",
  ];

  ingredients: { name: string, volume: string }[] = [
    { name: "Green Spinach", volume: "220 grams" },
    { name: "Seseme seeds", volume: "1 pinch" },
    { name: "Egg", volume: "4 nos." },
    { name: "Rice", volume: "2 bowl." },
    { name: "Jucchini", volume: "2 nos." },
    { name: "Vegetable Oil", volume: "30 ml" },
    { name: "Salt", volume: "As required" },
  ];

  segmentValue: string = 'ingredients';
  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      if (this.user){
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
      
      if(this.user && recipeId)
        this.categoryService.getRecipe(this.categoryId!, recipeId, this.user.username).pipe(first()).subscribe(
          recipe => {
            if(recipe){
              this.recipe = recipe;
            }
          });
      }
    );

  }
  getUsers(){
    if(this.user)
      this.usersService.getAllUsers().pipe(first()).subscribe(
        users => {
          if(users){
            this.users = users;
          }
        });
  }
  shareRecipe(){
    if (this.categoryId && this.recipe && this.userForm.valid && this.user) {
      const { role, username } = this.userForm.value;
      let category : Category | undefined;
      this.categoryService.getCategoryById(this.categoryId, this.user.username).pipe(first()).subscribe((value)=>{
      if(value){
        category = value
        if (username && this.recipe && this.categoryId && this.user) { 
          if (role === "editors" ) {
            this.recipe.editors = [...(this.recipe.editors || []), username] as string[];
            category.editors = [...(category.editors || []), username] as string[];
            
          } else if (role === "readers") {
            this.recipe.readers = [...(this.recipe.readers || []), username] as string[];
            category.readers = [...(category.readers || []), username] as string[];
          }
          this.categoryService.updateCategory(category).then((value)=>{
            if(value)
              this.presentToast('recipe successfully shared', 'success')
          });
          this.categoryService.updateRecipe(this.recipe, this.categoryId).then((value)=>{
            if(value)
              this.presentToast('recipe successfully shared', 'success')
          });
        }
      }
    })
    }
    
    
  }
}

addIcons({
  'caret-back': caretBack
});

