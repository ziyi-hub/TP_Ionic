import { CategoryService } from '../../services/category.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonBackButton,IonHeader, IonCardSubtitle, IonToolbar, IonCard, IonItem, IonCardContent, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import { CommonModule } from '@angular/common';
import { first } from 'rxjs'
import {UploadService} from "../../services/upload.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  standalone:true,
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonBackButton, IonCardSubtitle, IonHeader, IonToolbar, IonCard, IonItem, IonCardContent, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class CategoryModalComponent extends UtilitiesMixin implements OnInit {
  @Input() categoryId: string | undefined;
  private readonly CategoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);
  readonly uploadService = inject(UploadService);

  categoryForm = new FormGroup({
    name : new FormControl('', [Validators.required]),
    imgUrl : new FormControl(''), 
  });

  async ngOnInit(): Promise<void> {
    try {
      this.user = await this.getCurrentUser();
      if(this.user)
        this.loadCategory()
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  loadCategory() {
    try {
      if (this.categoryId && this.user) {
        this.CategoryService.getCategoryById(this.categoryId, this.user.username).pipe(first()).subscribe({
          next: (value: any) => {
            if (value) {
              this.categoryForm.setValue({
                name: value!.name,
                imgUrl: value!.imgUrl,
              });
            }
          },
          error: (error: any) => {
            const msg = "Error fetching category: " + error;
            this.presentToast(msg, "danger");
          },
          complete: () => {
            console.log('Observable terminé');
          }
        });
      }
    } catch (error) {
      const msg = "Error fetching category: " + error;
      this.presentToast(msg, "danger");
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(file: any, event: Event) {
    event.preventDefault();
    this.uploadService.uploadFile(file)
      .then((res: any) => {
        if(res) 
          this.categoryForm.value.imgUrl = res
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});
