import { Component, Input, OnInit, inject } from '@angular/core';
import {
  IonBackButton,
  IonSelect,
  IonCard,
  IonCardSubtitle,
  IonCardContent,
  IonSelectOption,
  IonTextarea,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonContent,
  IonInput,
  IonButtons,
  IonButton,
  ModalController,
  IonLabel,
  IonRow,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {checkmarkOutline, closeOutline} from 'ionicons/icons';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from 'src/app/models/recipe';
import { CategoryService } from 'src/app/services/category.service';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { first } from 'rxjs';
import {UploadService} from "../../services/upload.service";

@Component({
  standalone:true,
  selector: 'app-recipe-modal',
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
  imports : [ReactiveFormsModule, IonSelect, IonRow, IonLabel, IonCard, IonCardSubtitle, IonCardContent, IonSelectOption, IonBackButton,IonTextarea, IonIcon, IonItem, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, CommonModule ]
})
export class RecipeModalComponent extends UtilitiesMixin implements OnInit{
  @Input() recipeId : string |undefined;
  @Input() categoryId : string |undefined;
  recipe : Recipe | undefined ;
  recipeForm = new FormGroup({
    name : new FormControl('', [Validators.required]) ,
    serving:new FormControl('', [Validators.required]),
    duration:new FormControl('', [Validators.required]),
    steps: new FormControl([], [Validators.required]),
    ingredients : new FormControl([], [Validators.required]),
    tags : new FormControl([], [Validators.required]),
    readers : new FormControl([], [Validators.required]),
    editors : new FormControl([], [Validators.required]),
    imgUrl: new FormControl(''),
  });

  private readonly CategoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);
  public uploadService = inject(UploadService);

  numbers: number[] = Array.from({length: 21}, (_, i) => i);

  ingredientsForm: FormGroup;
  stepsForm: FormGroup;
  tagsForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
    this.ingredientsForm = this.formBuilder.group({
      ingredients: this.formBuilder.array([])
    });
    this.stepsForm = this.formBuilder.group({
      steps: this.formBuilder.array([])
    });
    this.tagsForm = this.formBuilder.group({
      tags: this.formBuilder.array([])
    });
  }

  get ingredients() {
    return this.ingredientsForm.get('ingredients') as FormArray;
  }

  get steps() {
    return this.stepsForm.get('steps') as FormArray;
  }

  get tags(){
    return this.tagsForm.get('tags') as FormArray;
  }

  addIngredient() {
    const ingredient = this.formBuilder.group({
      name: ['', [Validators.required]],
      volume: ['', [Validators.required]]
    });
    this.ingredients.push(ingredient);
  }

  addStep() {
    const step = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
    this.steps.push(step);
  }

  addTag(){
    const tag = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.tags.push(tag);
    console.log(this.tags.value);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  async ngOnInit() {
    try {
      this.user = await this.getCurrentUser();
      if(this.user)
        this.loadRecipe()
    } catch (error) {
      this.presentToast("Failed to retrieve logged-in user.", "danger")
    }
  }

  loadRecipe(){
    try {
      if (this.recipeId && this.categoryId && this.user) {
        this.CategoryService.getRecipe(this.categoryId, this.recipeId, this.user.username).pipe(first()).subscribe({
          next: (value: any) => {
            if (value) {
              this.recipeForm.setValue({
                name: value.name,
                serving: value.serving,
                duration: value.duration,
                steps: value.steps,
                ingredients: value.ingredients,
                tags: value.tags,
                readers: value.readers,
                editors: value.editors,
                imgUrl: value!.imgUrl,
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
    } catch (error) {
      const msg =  'Error fetching recipe: '+error
      this.presentToast(msg, 'danger')
    }

  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(id: string | undefined, file: any, event: Event) {
    event.preventDefault();
    this.uploadService.uploadFile(id, file)
      .then((res: any) => {
        if(res) this.recipeForm.value.imgUrl = res
        if(this.ingredients.value) this.recipeForm.value.ingredients = this.ingredients.value
        if(this.steps.value) this.recipeForm.value.steps = this.steps.value
        if(this.tags.value) this.recipeForm.value.tags = this.tags.value
        return this.modalCtrl.dismiss(this.recipeForm.value, 'confirm');
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline,
  'close-outline': closeOutline,
});

