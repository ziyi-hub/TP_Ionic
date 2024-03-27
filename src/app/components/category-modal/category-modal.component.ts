import { CategoryService } from '../../services/category.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IonBackButton,IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import { CommonModule } from '@angular/common';
import { first } from 'rxjs'
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
;
@Component({
  standalone:true,
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonBackButton, IonHeader, IonToolbar, IonItem, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class CategoryModalComponent extends UtilitiesMixin implements OnInit {
  @Input() categoryId: string | undefined;
  private readonly CategoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);
  categoryForm = new FormGroup({
    name : new FormControl('', [Validators.required]) });
  async ngOnInit(): Promise<void> {
    try {
      this.username = await this.getCurrentUserName();
      if(this.username)
        this.loadCategory()
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }
  loadCategory() {
    try {
      if (this.categoryId && this.username) {
        this.CategoryService.getCategoryById(this.categoryId, this.username).pipe(first()).subscribe({
          next: (value: any) => {
            if (value) {
              this.categoryForm.setValue({
                name: value!.name
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

  confirm() {
    return this.modalCtrl.dismiss(this.categoryForm.value, 'confirm');
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});