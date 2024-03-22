import { CategoryService } from 'src/app/services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/models/recipe';
import { addIcons } from 'ionicons';
import { caretBack } from 'ionicons/icons';
import { first } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RecipeDetailPage extends UtilitiesMixin implements OnInit {
  
  
  private readonly route = inject(ActivatedRoute);
  private readonly CategoryService = inject(CategoryService);
  recipe : Recipe  | undefined ;
  categoryId : string | undefined ;
  ngOnInit() {
    this.getCurrentRecipe()
  }
  getCurrentRecipe(){
    this.route.params.pipe(first()).subscribe(params => {
      this.categoryId = params['categoryId'];
      const recipeId = params['id'];
      if(this.username)
        this.CategoryService.getRecipe(this.categoryId!, recipeId, this.username).pipe(first()).subscribe(
          recipe => {
            if(recipe){
              this.recipe = recipe;
            }
          });
      }
    );

  }
}
addIcons({
  'caret-back': caretBack
});

