import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { UUID } from 'angular2-uuid';
import { addIcons } from 'ionicons';
import {
  logOutOutline,
  pencilOutline,
  personCircle,
  settingsOutline,
  trashOutline,
  personCircleOutline,
  eyeOutline,
  addCircle,
  ellipsisVertical,
  chevronDown,
  chevronUp
} from 'ionicons/icons';
import { TabPage } from '../components/tab/tab.page';
import { AsyncPipe } from "@angular/common";
import {Observable, first, of, map, pipe} from "rxjs";
import { CommonModule } from '@angular/common';
import {
  IonSearchbar,
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
  IonImg,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonToggle,
  IonAvatar,
  IonGrid,
  IonThumbnail,
  IonText,
} from '@ionic/angular/standalone';
import {UploadService} from "../services/upload.service";
import {SearchService} from "../services/search.service";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonSearchbar,
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
    IonImg,
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
  private readonly uploadService = inject(UploadService);

  categories$: Observable<Category[]> | undefined;
  sharedCategories$: Observable<Category[]> | undefined;
  
  constructor(public searchService: SearchService) {
    super();
  }

  async ngOnInit() {
    try {
          this.user = await this.getCurrentUser();
          if (this.user && this.user.id)
            this.loadCategories();
        } catch (error) {
          this.presentToast("Failed to retrieve logged-in user.", "danger");
        }
  }

  loadCategories(){
    this.categories$ = this.categoryService.getPrivateCategoriesObservable();
    this.sharedCategories$ = this.categoryService.getSharedCategoriesObservable();
  }

  handleInput(event: any) {
    const query = event.target.value.toLowerCase();

    if (!query) {
      if (this.user && this.user.id) {
        this.loadCategories();
      }
      return;
    }

    if (this.categories$) {
      this.categories$ = this.categories$.pipe(
        map(categories => categories.filter(category => category.name.toLowerCase().includes(query)))
      );
    }

    if (this.sharedCategories$) {
      this.sharedCategories$ = this.sharedCategories$.pipe(
        map(categories => categories.filter(category => category.name.toLowerCase().includes(query)))
      );
    }
  }

  async createCategory() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data && this.user) {
        const newCategory = {
          id: UUID.UUID(),
          name: data.data.name,
          imgUrl: data.data.imgUrl || '',
          owner: this.user.id
        };
        this.categoryService.addCategory(newCategory)
          .then((categoryAdded) => {
            if (this.user && this.user.id) {
              const message = categoryAdded.name + " is successfully created."
              this.presentToast(message, 'success');
              this.loadCategories()
            }
          })
          .catch((err) => {
            this.presentToast("in" + err, 'danger');
          });
      }
    });
    return await modal.present();
  }

showMyCategories: boolean = true;
showSharedCategories: boolean = true;

toggleMyCategories() {
  this.showMyCategories = !this.showMyCategories;
}

toggleSharedCategories() {
  this.showSharedCategories = !this.showSharedCategories;
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

      if (data && data.name && this.user && this.user.id) {
        const oldCategory = await this.categoryService.getCategoryById(categoryId, this.user.id).pipe(first()).toPromise();
        if (oldCategory) {
          const updatedCategory = {
            id: categoryId,
            name: data.name,
            imgUrl: data.imgUrl || oldCategory.imgUrl,
            owner: oldCategory.owner,
            readers: oldCategory.readers,
            editors: oldCategory.editors
          };
          if ((oldCategory.editors && this.user.id && oldCategory.editors.includes(this.user.id)) || oldCategory.owner == this.user.id) {
            await this.categoryService.updateCategory(updatedCategory).then(() => {
              if (this.user && this.user.id) {
                this.loadCategories();
                this.presentToast(`${updatedCategory.name} is successfully updated.`, 'success');
              }
            }).catch(() => {
              this.presentToast(`Failed to update ${oldCategory.name}.`, 'danger');
            });
          }
        }
      }
    } catch (error) {
      this.presentToast(error + "", 'danger');
    }
  }


  /**
   * Suppression un category
   * @param categoryId
   */
  async deleteCategory(categoryId: string) {
    if (this.user && this.user.id)
      this.categoryService.getCategoryById(categoryId, this.user.id).pipe(first()).subscribe({
        next: (value) => {
          if (value && value.name && this.user &&this.user.id) {
            this.categoryService.deleteCategory(categoryId, this.user.id)
              .then(async (isDeleted) => {
                if (isDeleted == true && this.user && this.user.id) {
                  if (value.imgUrl) {
                    const imagePath = this.uploadService.getPathStorageFromUrl(value.imgUrl);
                    await this.uploadService.deleteImageByFullPath(imagePath)
                  }
                  this.presentToast(`${value.name} is succesfully deleted.`, 'success')
                  this.loadCategories()
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
  'trash-outline': trashOutline,
  'pencil-outline': pencilOutline,
  'person-circle': personCircle,
  'settings-outline': settingsOutline,
  'log-out-outline': logOutOutline,
  'person-circle-outline': personCircleOutline,
  'eye-outline': eyeOutline,
  'add-circle': addCircle,
  'ellipsis-vertical' : ellipsisVertical,
  'chevron-down' : chevronDown,
  'chevron-up' : chevronUp
});
