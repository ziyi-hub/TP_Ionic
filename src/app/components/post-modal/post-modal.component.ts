import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IonTextarea, IonIcon, IonHeader, IonToolbar, IonTitle,IonItem, IonContent, IonInput, IonButtons, IonButton, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Post } from 'src/app/models/post';
import { TopicService } from 'src/app/services/topic.service';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';

@Component({
  standalone:true,
  selector: 'app-post-modal',
  templateUrl: './post-modal.component.html',
  styleUrls: ['./post-modal.component.scss'],
  imports : [ReactiveFormsModule, IonTextarea, IonIcon, IonItem, IonContent, IonInput, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, CommonModule ]
})
export class PostModalComponent extends UtilitiesMixin implements OnInit{
  @Input() postId : string |undefined;
  @Input() topicId : string |undefined;
  post : Post | undefined ;
  postForm = new FormGroup({
    name : new FormControl('', [Validators.required]) ,
    description : new FormControl('', [Validators.required])});

  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);
  
  ngOnInit() {
    this.loadPost()
  }
  loadPost(){
    try {
      if (this.postId && this.topicId) {
        this.postSubscription = this.topicService.getPost(this.topicId, this.postId).subscribe((value)=>{
          if (value && value.description) {
            this.postForm.setValue({
              name: value!.name,
              description : value!.description
            });
          }
        });
      }
    } catch (error) {
      const msg =  'Error fetching post: '+error
      this.presentToast(msg, 'danger')
    }
    
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.postForm.value, 'confirm');
  } 
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});

