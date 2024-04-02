import { CommonModule } from '@angular/common';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Recipe } from '../../models/recipe';
import { CategoryService } from '../../services/category.service';
import { Component, OnInit, inject } from '@angular/core';
import { RecipeModalComponent } from "../../components/recipe-modal/recipe-modal.component";
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { ReactiveFormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonFabList,
  IonActionSheet,
  IonButtons,
  IonFab,
  IonFabButton,
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItemSliding,
  IonIcon,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonItem,
  IonButton,
  IonCardContent,
  IonCard,
  IonRow,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircle,
  caretBack,
  ellipsisVertical,
  pencilOutline,
  shareSocialOutline,
  trashOutline
} from 'ionicons/icons';
import { UUID } from 'angular2-uuid';
import { first, map } from 'rxjs';
import {UploadService} from "../../services/upload.service";
import { ShareModalComponent } from 'src/app/components/share-modal/share-modal.component';

@Component({
  standalone: true,
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
  imports: [IonActionSheet, CommonModule, IonCard, IonRow, IonCardContent, IonButton, IonFabList, IonActionSheet, IonSelect, IonSelectOption, ReactiveFormsModule, IonButton, IonBackButton, IonButtons, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem]
})

export class CategoryDetailPage extends UtilitiesMixin implements OnInit {
  recipes: Recipe[] = [];
  category: Category | undefined;
  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  private readonly route = inject(ActivatedRoute);
  private readonly uploadService = inject(UploadService);


  constructor(public actionSheetController: ActionSheetController) {
    super();
  }

  async presentActionSheet(recipe: Recipe) {
    const buttons = [
      {
        text: 'Edit',
        handler: () => {
          this.updateRecipe(recipe.id);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      }
    ];

    if (this.user && this.user.id === recipe.owner) {
      buttons.splice(1, 0, {
        text: 'Share',
        handler: () => {
          this.shareRecipe(recipe);
        }
      },
      {
        text: 'Delete',
        role: 'destructive',
        handler: () => {
            this.presentAlertDelete((categoryId: string) => this.deleteRecipe(recipe.id, recipe.owner), recipe.id, recipe.name);
        }
      });
    }

    const actionSheet = await this.actionSheetController.create({
      buttons: buttons
    });
    await actionSheet.present();
  }


  /**
   * Charger les categories lors de l'initialisation de la page
   */
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
      if (this.user && this.user.id)
        this.categoryService.getCategoryById(categoryId, this.user.id).pipe(first()).subscribe(
          async category => {
            if (category && this.user && this.user.id) {
              this.category = category;
              (await this.categoryService.getRecipesByCategoryId(categoryId, this.user.id)).pipe(
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
      if (!!data && data.data && this.category && this.user && this.user.id) {
        const recipeValue = {
          id: UUID.UUID(),
          name: data.data.name,
          duration: data.data.duration,
          serving: data.data.serving,
          imgUrl: data.data.imgUrl,
          owner: this.user.id,
          steps: data.data.steps,
          ingredients: data.data.ingredients,
          tags: data.data.tags,
          readers: data.data.readers,
          editors: data.data.editors,
        }
        this.categoryService.addRecipe(recipeValue, this.category.id)
          .then((res: Recipe) => {
            if(res){
              const message = res.name + " is successfully created."
              this.presentToast(message, 'success');
            }
            
          })
          .catch((err) => {
            this.presentToast(err, 'danger');
          })
        this.getCurrentCategory();
      }
    });

    return await modal.present();
  }

  async deleteRecipe(recipeId: string, id: string) {
    if (recipeId && this.category) {
      this.categoryService.getRecipe(this.category.id, recipeId, id).pipe(first()).subscribe({
        next: (value: Recipe | undefined) => {
          if (value && this.user && value.owner === this.user.id) {
            this.categoryService.deleteRecipe(recipeId, this.category!.id)
              .then(async (isDeleted: boolean) => {
                if (isDeleted === true) {
                  if (value.imgUrl) {
                    const imagePath = this.uploadService.getPathStorageFromUrl(value.imgUrl);
                    await this.uploadService.deleteImageByFullPath(imagePath)
                  }
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
  async shareRecipe(recipe:Recipe) {
    const modal = await this.modalController.create({
      component: ShareModalComponent,
      componentProps: {
        recipe: recipe,
        categoryId: this.category?.id
      }
    });
    modal.onWillDismiss().then(async (data) => {
      if (this.category?.id && data && data.data && this.user && this.user.id) {
        let category: Category = this.category;

            if (data.data.user['id'] && recipe && category && category.id && this.user) {
              if (data.data.role === "editors") {
                recipe.editors = [...(recipe.editors || []), data.data.user['id']] as string[];
                category.editors = [...(category.editors || []), data.data.user['id']] as string[];

              } else if (data.data.role === "readers") {
                recipe.readers = [...(recipe.readers || []), data.data.user['id']] as string[];
                category.readers = [...(category.readers || []), data.data.user['id']] as string[];
              }
              const categoryUpdated = await this.categoryService.updateCategory(category);
              const recipeUpdated = await this.categoryService.updateRecipe(recipe, this.category?.id);
              this.presentToast(`${recipe?.name} successfully shared`, 'success')
            }
      }
    });
    return await modal.present();
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
      if (!!data && data.data && this.category && this.user && this.user.id) {
        const oldRecipe = await this.categoryService.getRecipe(this.category.id, recipeId, this.user.id).pipe(first()).toPromise();
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
          if ((oldRecipe.editors && this.user.id && oldRecipe.editors.includes(this.user.id)) || oldRecipe.owner == this.user.id) {
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
  'add-circle': addCircle,
  'trash-outline': trashOutline,
  'pencil-outline': pencilOutline,
  'caret-back': caretBack,
  'share-social-outline': shareSocialOutline,
  'ellipsis-vertical': ellipsisVertical,
});
