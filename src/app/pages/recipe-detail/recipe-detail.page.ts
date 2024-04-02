import { CategoryService } from 'src/app/services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonFab,
  IonGrid,
  IonFabButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonButton,
  IonRow,
  IonCol,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonList, IonSelect, IonSelectOption, ModalController
} from '@ionic/angular/standalone';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/models/recipe';
import { addIcons } from 'ionicons';
import { arrowBackOutline, caretBack } from 'ionicons/icons';
import { first } from 'rxjs';
import { User } from 'src/app/models/user';
import { Category } from 'src/app/models/category';
import { ShareModalComponent } from 'src/app/components/share-modal/share-modal.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
  standalone: true,
  imports: [IonSelect, IonSelectOption, IonList, CommonModule, IonRow, IonGrid, IonCol, IonCheckbox, IonSegment, IonSegmentButton, IonButton, ReactiveFormsModule, IonButton, IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonLabel, IonItem]

})
export class RecipeDetailPage extends UtilitiesMixin implements OnInit {


  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController)
  recipe: Recipe | undefined;
  categoryId: string | undefined;
  users: User[] | undefined;

  segmentValue: string = 'ingredients';

  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      if (this.user) {
        this.getCurrentRecipe()
      }
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  getCurrentRecipe() {
    this.route.params.pipe(first()).subscribe(params => {
      this.categoryId = params['categoryId'];
      const recipeId = params['id'];

      if (this.user && this.user.id && recipeId)
        this.categoryService.getRecipe(this.categoryId!, recipeId, this.user.id).pipe(first()).subscribe(
          recipe => {
            if (recipe) {
              this.recipe = recipe;
            }
          });
    }
    );

  }
  async shareRecipe() {
    const modal = await this.modalController.create({
      component: ShareModalComponent,
      componentProps: {
        recipe: this.recipe,
        categoryId: this.categoryId
      }
    });
    modal.onWillDismiss().then((data) => {
      if (this.categoryId && data && data.data && this.user && this.user.id) {
        let category: Category | undefined;
        this.categoryService.getCategoryById(this.categoryId, this.user.id).pipe(first()).subscribe(async (value) => {
          if (value) {
            category = value
            if (data.data.user.id && this.recipe && this.categoryId && this.user) {
              if (data.data.role === "editors") {
                this.recipe.editors = [...(this.recipe.editors || []), data.data.user.idd] as string[];
                category.editors = [...(category.editors || []), data.data.user.id] as string[];

              } else if (data.data.role === "readers") {
                this.recipe.readers = [...(this.recipe.readers || []), data.data.user.id] as string[];
                category.readers = [...(category.readers || []), data.data.user.id] as string[];
              }
             
              const categoryUpdated = await this.categoryService.updateCategory(category);
              const recipeUpdated = await this.categoryService.updateRecipe(this.recipe, this.categoryId);
              this.presentToast(`${this.recipe?.name} successfully shared`, 'success')
            }
          }
        });
      }
    });
    return await modal.present();
  }
}

addIcons({
  'caret-back': caretBack,
  'arrow-back-outline': arrowBackOutline
});

