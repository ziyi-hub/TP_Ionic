import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { Post } from '../../models/post';
import { TopicService } from '../../services/topic.service';
import {Component, OnInit, inject} from '@angular/core';
import {PostModalComponent} from "../../components/post-modal/post-modal.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../../models/topic';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalController, IonItemSliding} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, caretBack, pencilOutline, trashOutline } from 'ionicons/icons';
import { UUID } from 'angular2-uuid';
import { map } from 'rxjs';
import {IonicModule} from "@ionic/angular";
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['../category-detail/category-detail.page.scss'],
  imports : [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})

export class TopicDetailPage extends UtilitiesMixin implements OnInit {
  posts: Post[] = [];
  topic: Topic | undefined;
  private readonly topicService = inject(TopicService);
  private readonly modalController= inject(ModalController);
  private readonly route = inject(ActivatedRoute);
  
  recipes = [
    {
      name: "Turkey Noodle Soup",
      img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Vegetable Soup",
      img: "https://images.unsplash.com/photo-1519202270721-a737823482cc?q=80&w=1634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    }
  ]


  /**
   * Charger les topics lors de l'initialisation de la page
   */
  ngOnInit() {
    this.getCurrentTopic();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */

  getCurrentTopic(){
    this.route.params.subscribe(params => {
      const topicId = params['id'];
      this.topicService.getTopicById(topicId).subscribe(
        topic => {
          if(topic){
            this.topic = topic;
            this.topicService.getPostsByTopicId(topicId).pipe(
              map((posts: any) => posts.sort((a: { name: string; }, b: { name: any; }) => a.name.localeCompare(b.name)))
          ).subscribe({
              next: (posts: any) => {
                if(posts)
                  this.posts = posts
              },
              error: (error: any) => {
                this.presentToast(error,  'danger');
              },
              complete: () => {
                console.log('Observable terminé');
              }
            });
          }
        });
    }
    );

  }
  showPost(topicId: string, postId : string){
    this.router.navigate(['/topic-detail/', topicId, 'post-detail', postId]);
  }
  /**
   * Ouvrir fenetre Modal
   */
  async createPost() {
    const modal = await this.modalController.create({
      component: PostModalComponent,
    });

    modal.onWillDismiss().then((data) => {

      if (!!data && data.data && this.topic) {
        const newPost = { id: UUID.UUID(), name: data.data.name, description: data.data.description }
        this.topicService.addPost(newPost, this.topic.id)
          .then((res: Post) => {
            const message = res.name + " is successfully created."
            this.presentToast(message, 'success');
          })
          .catch((err) => {
            this.presentToast(err,  'danger');
          })
        this.getCurrentTopic();
       }
    });

    return await modal.present();
  }

  async deletePost(postId: string) {
    if (postId) {
      this.topicService.getPost(this.topic!.id, postId).subscribe({
      next: (value: any) => {
        if (value && value.name) {
          this.topicService.deletePost(postId, this.topic!.id)
            .then((isDeleted: any) => {
              if(isDeleted === true){
                const message = value.name + " is succesfully deleted.";
                this.presentToast(message,  'success')
              }
            })
            .catch((err: any) => {
              this.presentToast(err.message, 'danger');
            })
        }
      },
      error: (error: any) => {
        this.presentToast(error, 'danger');
      },
      complete: () => {
        console.log('Observable terminé');
      }
    });
  }else{
    this.presentToast('Invalid id', 'danger');
  }
}

  async editPost(postId: string) {
    const modal = await this.modalController.create({
      component: PostModalComponent,
      componentProps: {
        postId: postId,
        topicId: this.topic?.id
      }
    });
    modal.onWillDismiss().then((data) => {
      if (!!data && data.data && this.topic) {
        const post = { id: postId, name: data.data.name, description: data.data.description }
        this.topicService.updatePost(post, this.topic.id)
          .then((updatedPost: any) => {
            const message = updatedPost.name + " is successfully updated."
            this.presentToast(message, 'success');
          })
          .catch((err: any) => {
            this.presentToast(err, 'danger');
          })
        this.getCurrentTopic();
       }
    });
    return await modal.present();
  }
  closeIonSliding(ionItemSliding:IonItemSliding){
    ionItemSliding.close()
  }
}

addIcons({
  'add-outline': addOutline,
  'trash-outline' : trashOutline,
  'pencil-outline' : pencilOutline,
  'caret-back': caretBack
});
