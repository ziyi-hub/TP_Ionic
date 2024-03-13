import { TopicService } from './../../services/topic.service';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { IonBackButton,IonHeader, IonToolbar, IonItem, ModalController, IonButton, IonTitle,  IonButtons, IonContent, IonInput, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline } from 'ionicons/icons';
import {UtilitiesMixin} from 'src/app/mixins/utilities-mixin'
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  standalone:true,
  selector: 'app-topic-modal',
  templateUrl: './topic-modal.component.html',
  styleUrls: ['./topic-modal.component.scss'],
  imports:[ReactiveFormsModule,CommonModule, IonBackButton, IonHeader, IonToolbar, IonItem, IonButton, IonTitle, IonButtons, IonContent, IonInput, IonIcon]
})
export class TopicModalComponent extends UtilitiesMixin implements OnInit, OnDestroy {
  @Input() topicId: string | undefined;
  private readonly topicService = inject(TopicService);
  private readonly modalCtrl = inject(ModalController);
  name = new FormControl('', [Validators.required]);

  async ngOnInit(): Promise<void> {
    this.loadTopic();
  }
  loadTopic() {
    try {
      if (this.topicId) {
        this.subscription = this.topicService.getTopicById(this.topicId).subscribe({
          next: (value: any) => {
            if (value) {
              this.name.setValue(value.name);
            } 
          },
          error: (error: any) => {
            const msg = "Error fetching topic: " + error;
            this.presentToast(msg, "danger");
          },
          complete: () => {
            console.log('Observable terminé');
          }
        });
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