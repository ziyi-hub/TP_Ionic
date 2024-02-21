import { TopicService } from './../../services/topic.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import {
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Topic } from 'src/app/models/topic';
@Component({
  standalone:true,
  selector: 'app-topic-modal',
  templateUrl: './topic-modal.component.html',
  styleUrls: ['./topic-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonHeader, IonToolbar, IonItem, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class TopicModalComponent extends UtilitiesMixin implements OnInit {
  @Input() topicId: string | undefined;
  topic : Topic | undefined ;
  name = new FormControl('');

  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);
  async ngOnInit(): Promise<void> {
    try {
      // if(this.topicId){
      //   this.topic = this.topicService.get(this.topicId);
      //   if(this.topic)
      //     this.name.setValue(this.topic.name);
      //   else
      //     this.presentToast("Topic not found", "danger")
      // }
    } catch (error) {
      const msg = "Error fetching topic: " + error
      this.presentToast(msg, "danger")

    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name.value, 'confirm');
  }
}
addIcons({
  'checkmark-outline' : checkmarkOutline
});