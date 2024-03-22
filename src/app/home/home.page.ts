import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { IonBackButton, IonButtons, ModalController, IonFab, IonFabButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemSliding, IonIcon, IonItemOption, IonItemOptions, IonLabel, IonItem, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline} from 'ionicons/icons';
import { UUID } from 'angular2-uuid';

import {Observable, first, map} from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButton, 
    IonFab,
    IonFabButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonIcon,
    IonBackButton, 
    IonButtons,
    IonItemOption,
    IonItemOptions,
    IonLabel,
    IonItem,
    AsyncPipe,
  ],
})

export class HomePage extends UtilitiesMixin implements OnInit{
 
  private readonly CategoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  categories$ : Observable<Category[]> | undefined;
  async ngOnInit() {
    try {
      this.username = await this.getCurrentUserName();
      if(this.username)
        this.categories$ = this.CategoryService.getAllCategories(this.username).pipe(
          map((categories: any[]) => categories.sort((a, b) => a.name.localeCompare(b.name)))
        );
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }
  // Sort the categories$ Observable alphabetically by category name
  
  

  /**
   * Ouvrir Modal Category
   */
  async createCategory() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data &&this.username) {
        const newCategory = {
          id: UUID.UUID(),
          name: data.data.name,
          imgUrl: data.data.imgUrl || '',
          owner: this.username
        };
        this.CategoryService.addCategory(newCategory)
          .then((categoryAdded: any) => {
            const message =  categoryAdded.name + " is successfully created."
            this.presentToast(message, 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'danger');
          })
      }
    });

    return await modal.present();
  }

  /**
   * Redirect page
   * @param categoryId
   */
  navigateToDetail(categoryId: string) {
    this.router.navigate(['/category-detail', categoryId]);
  }
  logout(){
    this.authService.logOut();
    this.loadUser();
  }
  /**
   * Mise à jour un category
   * @param categoryId
   */
  async updateCategory(categoryId: string)  {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      componentProps: {
        categoryId: categoryId
      }
    });

    modal.onWillDismiss().then((data) => {
      if (!!data && data.data) {
          // const updatedCategory = { id: categoryId, name: data.data, recipes: [] }
          // this.CategoryService.updateCategory(updatedCategory)
          //   .then((categoryUpdated: any) => {
          //     const message = categoryUpdated.name + " is successfully updated."
          //     this.presentToast(message, 'success');
          //   })
          //   .catch((err) => {
          //     this.presentToast(err, 'danger');
          //   })
      }
    });
    return await modal.present();
  }
  /**
   * Suppression un category
   * @param categoryId
   */
  async deleteCategory(categoryId: string){
    if(this.username)
      this.CategoryService.getCategoryById(categoryId, this.username).pipe(first()).subscribe({
        next: (value: any) => {
          if (value && value.name) {
            this.CategoryService.deleteCategory(categoryId)
              .then((isDeleted: any) => {
                if(isDeleted === true){
                  const message = value.name + " is succesfully deleted.";
                  this.presentToast(message,  'success')
                }
              })
              .catch((err:any) => {
                this.presentToast(err, 'danger');
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
  closeIonSliding(ionItemSliding:IonItemSliding){
    ionItemSliding.close()
  }
  
}

addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'pencil-outline' : pencilOutline
});
