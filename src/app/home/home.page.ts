import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { UUID } from 'angular2-uuid';
import { addIcons } from 'ionicons';
import {
  addOutline,
  logOutOutline,
  pencilOutline,
  personCircle,
  settingsOutline,
  trashOutline,
  personCircleOutline,
  eyeOutline,
  addCircle
} from 'ionicons/icons';
import { TabPage } from '../components/tab/tab.page';
import { AsyncPipe } from "@angular/common";
import { Observable, first, of } from "rxjs";
import { CommonModule } from '@angular/common';
import {
  IonBackButton,
  IonButtons,
  ModalController,
  IonFab,
  IonFabButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItemSliding,
  IonIcon,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonItemOption,
  IonItemOptions,
  IonLabel,
  IonItem,
  IonButton,
  IonCardTitle,
  IonCardSubtitle,
  IonRow,
  IonCol,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonToggle,
  IonAvatar,
  IonGrid,
  IonThumbnail,
  IonText,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
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
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonRow,
    IonCol,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonToggle,
    TabPage,
    IonAvatar,
    IonGrid,
    IonThumbnail,
    IonText,
  ],
})

export class HomePage extends UtilitiesMixin implements OnInit {

  private readonly categoryService = inject(CategoryService);
  private readonly modalController = inject(ModalController);
  categories$: Observable<Category[]> | undefined;
  sharedCategories$: Observable<Category[]> | undefined;
  async ngOnInit() {
    try {
      this.username = await this.getCurrentUserName();
      if (this.username)
        this.loadCategories(this.username)
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  loadCategories(username: string) {
    try {
      const subscription = this.categoryService.getPrivateCategories(username).subscribe((categories: any[]) => {
        this.categories$ = of(categories.sort((a, b) => a.name.localeCompare(b.name)));
        subscription.unsubscribe();
      });
      const sharedSubscription = this.categoryService.getSharedCategories(username).subscribe((categories: any[]) => {
        this.sharedCategories$ = of(categories.sort((a, b) => a.name.localeCompare(b.name)));
        sharedSubscription.unsubscribe();
      });
    } catch (error) {
      const msg = 'Error fetching categories: ' + error
      this.presentToast(msg, 'danger')
    }

  }

  async createCategory() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data && this.username) {
        const newCategory = {
          id: UUID.UUID(),
          name: data.data.name,
          imgUrl: data.data.imgUrl || '',
          owner: this.username
        };
        this.categoryService.addCategory(newCategory)
          .then((categoryAdded) => {
            if (this.username) {
              const message = categoryAdded.name + " is successfully created."
              this.presentToast(message, 'success');
              this.loadCategories(this.username)
            }
          })
          .catch((err) => {
            this.presentToast("in" + err, 'danger');
          });
      }
    });
    return await modal.present();
  }



  logout() {
    this.authService.logOut();
    this.loadUser();
  }
  /**
   * Mise à jour un category
   * @param categoryId
   */
  async updateCategory(categoryId: string) {
    try {
      const modal = await this.modalController.create({
        component: CategoryModalComponent,
        componentProps: {
          categoryId: categoryId
        }
      });

      await modal.present();

      const { data } = await modal.onWillDismiss();

      if (data && data.name && this.username) {
        const oldCategory = await this.categoryService.getCategoryById(categoryId, this.username).pipe(first()).toPromise();

        if (oldCategory) {
          const updatedCategory = {
            id: categoryId,
            name: data.name,
            imgUrl: data.imgUrl || oldCategory.imgUrl,
            owner: oldCategory.owner,
            readers: oldCategory.readers,
            editors: oldCategory.editors
          };
          if((oldCategory.editors && oldCategory.editors.includes(this.username) )|| oldCategory.owner == this.username){
            await this.categoryService.updateCategory(updatedCategory);
            const message = `${updatedCategory.name} is successfully updated.`;
            this.loadCategories(this.username);
            this.presentToast(message, 'success');
          }
        }
      }
    } catch (error) {
      this.presentToast(error+"", 'danger');
    }
  }


  /**
   * Suppression un category
   * @param categoryId
   */
  async deleteCategory(categoryId: string) {
    if (this.username)
      this.categoryService.getCategoryById(categoryId, this.username).pipe(first()).subscribe({
        next: (value) => {
          if (value && value.name) {
            this.categoryService.deleteCategory(categoryId)
              .then((isDeleted) => {
                if (isDeleted === true && this.username) {
                  const message = value.name + " is succesfully deleted.";
                  this.loadCategories(this.username)
                  this.presentToast(message, 'success')
                }
              })
              .catch((err) => {
                this.presentToast(err, 'danger');
              });
          }
        },
        error: (error) => {
          this.presentToast(error, 'danger');
        },
        complete: () => {
          console.log('Observable terminé');
        }
      });
  }

  /**
   * Redirect page
   * @param categoryId
   */
  navigateToDetail(categoryId: string) {
    this.router.navigate(['/category-detail', categoryId]);
  }

  closeIonSliding(ionItemSliding: IonItemSliding) {
    ionItemSliding.close()
  }

}

addIcons({
  'add-outline': addOutline,
  'trash-outline': trashOutline,
  'pencil-outline': pencilOutline,
  'person-circle': personCircle,
  'settings-outline': settingsOutline,
  'log-out-outline': logOutOutline,
  'person-circle-outline': personCircleOutline,
  'eye-outline': eyeOutline,
  'add-circle': addCircle,
});
