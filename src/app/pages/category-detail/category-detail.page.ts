import { CommonModule } from '@angular/common';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Recipe } from '../../models/recipe';
import { CategoryService } from '../../services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { RecipeModalComponent } from "../../components/recipe-modal/recipe-modal.component";
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { ReactiveFormsModule } from '@angular/forms';
import { IonBackButton, IonSelect, IonSelectOption, IonButtons, IonFab, IonFabButton, ModalController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem, IonButton, IonCardContent, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, caretBack, pencilOutline, shareSocialOutline, trashOutline } from 'ionicons/icons';
import { UUID } from 'angular2-uuid';
import { first, map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
  imports: [CommonModule, IonCard, IonCardContent, IonButton, IonSelect, IonSelectOption, ReactiveFormsModule, IonButton, IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem]
})

export class CategoryDetailPage extends UtilitiesMixin implements OnInit {
  recipes: Recipe[] = [];
  category: Category | undefined;
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  private readonly route = inject(ActivatedRoute);

  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      if (this.user)
        this.getCurrentCategory();
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  getCurrentCategory() {
    this.route.params.pipe(first()).subscribe(params => {
      const categoryId = params['id'];
      if (this.user)
        this.categoryService.getCategoryById(categoryId, this.user.username).pipe(first()).subscribe(
          category => {
            if (category && this.user) {
              this.category = category;
              this.categoryService.getRecipesByCategoryId(categoryId, this.user.username).pipe(
                map((recipes: Recipe[] | undefined) => recipes ? recipes.sort((a: { name: string; }, b: { name: string; }) => a.name.localeCompare(b.name)) : [])
              ).subscribe({
                next: (recipes: Recipe[] | undefined) => {
                  if (recipes) {
                    this.recipes = recipes
                  }
                },
                error: (error: string) => {
                  this.presentToast(error, 'danger');
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
  
  async createRecipe() {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.category && this.user) {
        const recipeValue = {
          id: UUID.UUID(),
          name: data.data.name,
          duration: data.data.duration,
          serving: data.data.serving,
          imgUrl: data.data.imgUrl,
          owner: this.user.username,
          steps: data.data.steps,
          ingredients: data.data.ingredients,
          tags: data.data.tags,
          readers: data.data.readers,
          editors: data.data.editors,
        }
        this.categoryService.addRecipe(recipeValue, this.category.id)
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
      this.categoryService.getRecipe(this.category!.id, recipeId, username).pipe(first()).subscribe({
        next: (value: Recipe | undefined) => {
          if (value && this.user && value.owner === this.user.username) {
            this.categoryService.deleteRecipe(recipeId, this.category!.id)
              .then((isDeleted: boolean) => {
                if (isDeleted === true) {
                  const message = value.name + " is succesfully deleted.";
                  this.presentToast(message, 'success')
                }
              })
              .catch(() => {
                this.presentToast(`Failed to delete ${value.name}`, 'danger');
              })
          }
        },
        error: () => {
          this.presentToast("Failed to retrieve recipe", 'danger');
        }
      });
    } else {
      this.presentToast('Invalid id', 'danger');
    }
  }

  async updateRecipe(recipeId: string) {
    const modal = await this.modalController.create({
      component: RecipeModalComponent,
      componentProps: {
        recipeId: recipeId,
        categoryId: this.category?.id
      }
    });
    modal.onWillDismiss().then(async (data) => {
      if (!!data && data.data && this.category && this.user) {
        const oldRecipe = await this.categoryService.getRecipe(this.category.id, recipeId, this.user.username).pipe(first()).toPromise();
        if (oldRecipe) {
          const recipeValue = {
            id: recipeId,
            name: data.data.name,
            duration: data.data.duration,
            serving: data.data.serving,
            owner: oldRecipe.owner,
            imgUrl: data.data.imgUrl || oldRecipe.imgUrl,
            steps: data.data.steps,
            ingredients: data.data.ingredients,
            tags: data.data.tags,
            readers: oldRecipe.readers,
            editors: oldRecipe.editors
          }
          if ((oldRecipe.editors && oldRecipe.editors.includes(this.user.username)) || oldRecipe.owner == this.user.username) {
            await this.categoryService.updateRecipe(recipeValue, this.category.id)
              .then((updatedRecipe: Recipe) => {
                const message = updatedRecipe.name + " is successfully updated."
                this.presentToast(message, 'success');
              })
              .catch(() => {
                this.presentToast(`Failed to update ${oldRecipe.name}.`, 'danger');
              })
            this.getCurrentCategory();
          }
        }
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
  'caret-back': caretBack,
  'share-social-outline': shareSocialOutline,
});
