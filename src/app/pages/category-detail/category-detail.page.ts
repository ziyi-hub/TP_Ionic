import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Recipe } from '../../models/recipe';
import { CategoryService } from '../../services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { RecipeModalComponent } from "../../components/recipe-modal/recipe-modal.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../models/category';
import { ReactiveFormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonFab, IonFabButton, ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, caretBack, pencilOutline, trashOutline } from 'ionicons/icons';
import { UUID } from 'angular2-uuid';
import { first, map } from 'rxjs';
import { user } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
  imports: [ReactiveFormsModule, IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem]
})

export class CategoryDetailPage extends UtilitiesMixin implements OnInit {
  recipes: Recipe[] = [];
  category: Category | undefined;
  private readonly CategoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  private readonly route = inject(ActivatedRoute);

  /**
   * Charger les categories lors de l'initialisation de la page
   */
  async ngOnInit() {
    try {
      this.username = await this.getCurrentUserName();
      if (this.username)
        this.getCurrentCategory();
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  /**
   * Utiliser le service pour récupérer tous les categories
   */

  getCurrentCategory() {
    this.route.params.pipe(first()).subscribe(params => {
      const categoryId = params['id'];
      if (this.username)
        this.CategoryService.getCategoryById(categoryId, this.username).pipe(first()).subscribe(
          category => {
            if (category) {
              this.category = category;
              this.CategoryService.getRecipesByCategoryId(categoryId).pipe(
                map((recipes: any) => recipes.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)))
              ).subscribe({
                next: (recipes: any) => {
                  if (recipes)
                    this.recipes = recipes
                },
                error: (error: any) => {
                  this.presentToast(error, 'danger');
                },
                complete: () => {
                  console.log('Observable terminé');
                }
              });
            }
          });
    }
    );

  }
  showRecipe(categoryId: string, recipeId: string) {
    this.router.navigate(['/category-detail/', categoryId, 'recipe-detail', recipeId]);
  }
  /**
   * Ouvrir fenetre Modal
   */
  async createRecipe() {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.category) {
        const recipeValue = {
          id: UUID.UUID(),
          name: data.data.name,
          duration: data.data.duration,
          serving: data.data.serving,
          steps: data.data.steps,
          ingredients: data.data.ingredients,
          tags: data.data.tags,
          readers: data.data.readers
        }
        this.CategoryService.addRecipe(recipeValue, this.category.id)
          .then((res: Recipe) => {
            const message = res.name + " is successfully created."
            this.presentToast(message, 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'danger');
          })
        this.getCurrentCategory();
      }
    });

    return await modal.present();
  }

  async deleteRecipe(recipeId: string, username: string) {
    if (recipeId) {
      this.CategoryService.getRecipe(this.category!.id, recipeId, username).pipe(first()).subscribe({
        next: (value: any) => {
          if (value && value.name) {
            this.CategoryService.deleteRecipe(recipeId, this.category!.id, username)
              .then((isDeleted: any) => {
                if (isDeleted === true) {
                  const message = value.name + " is succesfully deleted.";
                  this.presentToast(message, 'success')
                }
              })
              .catch((err: any) => {
                this.presentToast(err.message, 'danger');
              })
          }
        },
        error: (error: any) => {
          this.presentToast(error, 'danger');
        },
        complete: () => {
          console.log('Observable terminé');
        }
      });
    } else {
      this.presentToast('Invalid id', 'danger');
    }
  }

  async editRecipe(recipeId: string) {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
      componentProps: {
        recipeId: recipeId,
        categoryId: this.category?.id
      }
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data && this.category) {
        const recipeValue = {
          id: recipeId,
          name: data.data.name,
          duration: data.data.duration,
          serving: data.data.serving,
          steps: data.data.steps,
          ingredients: data.data.ingredients,
          tags: data.data.tags,
          readers: data.data.readers
        }
        this.CategoryService.updateRecipe(recipeValue, this.category.id)
          .then((updatedRecipe: any) => {
            const message = updatedRecipe.name + " is successfully updated."
            this.presentToast(message, 'success');
          })
          .catch((err: any) => {
            this.presentToast(err, 'danger');
          })
        this.getCurrentCategory();
      }
    });
    return await modal.present();
  }
  closeIonSliding(ionItemSliding: IonItemSliding) {
    ionItemSliding.close()
  }
}

addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'pencil-outline': pencilOutline,
  'caret-back': caretBack
});
