import { Observable, filter, map, Subscription } from 'rxjs';
import { TopicService } from './../../services/topic.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
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
export class TopicModalComponent extends UtilitiesMixin implements OnInit, OnDestroy {
  @Input() topicId: string | undefined;
  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);
  topic$ : Observable<Topic | undefined> | undefined ;
  name = new FormControl('', [Validators.required]);

  async ngOnInit(): Promise<void> {
    this.loadTopic();
  }
  loadTopic() {
    try {
      if (this.topicId) {
        this.postSubscription = this.topicService.getTopicById(this.topicId).subscribe(
          (value) => {
            if (value) {
              this.name.setValue(value.name);
            } else {
              this.presentToast("Topic not found", "danger");
            }
          },
          (error) => {
            const msg = "Error fetching topic: " + error;
            this.presentToast(msg, "danger");
          }
        );
      }
    } catch (error) {
      const msg = "Error fetching topic: " + error;
      this.presentToast(msg, "danger");
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