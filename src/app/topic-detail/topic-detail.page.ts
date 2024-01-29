import {Component, OnInit} from '@angular/core';
import {PostModalComponent} from "../components/post-modal/post-modal.component";
import { ActivatedRoute } from '@angular/router';
import {PostService} from "../services/post.service";
import {ModalController, ToastController} from "@ionic/angular";
import {Post} from '../models/post';
import {TopicService} from "../services/topic.service";

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
})
export class TopicDetailPage implements OnInit {
  posts: Post[] = [];
  topicId: number | null = -1;
  topicName: string | undefined = "";

  constructor(
    private postService: PostService,
    private topicService: TopicService,
    private modalController: ModalController,
    private toastController: ToastController,
    private route: ActivatedRoute,
  ) {}

  /**
   * Charger les topics lors de l'initialisation de la page
   */
  ngOnInit() {
    // Utilisation de paramMap pour récupérer les paramètres de l'URL
    this.topicId = parseInt(<string>this.route.snapshot.paramMap.get('id'));
    this.topicName = this.topicService.getNameById(this.topicId);
    this.loadPosts();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */
  loadPosts() {
    this.posts = this.postService.getAll();
  }

  /**
   * Ouvrir fenetre Modal
   */
  async openModal() {
    const modal = await this.modalController.create({
      component: PostModalComponent,
    });

    modal.onWillDismiss().then((data) => {
      // console.log(data.data);
      if (!!data && data.data) {
        // Add the new post to the list
        const newPost = { id: 1, name: data.data.name, description: data.data.description }
        this.postService.addPost(newPost)
          .then(() => {
            this.presentToast(data.data.name, 'bottom', 'success');
          })
          .catch((err) => {
            this.presentToast(err, 'bottom', 'danger');
          })
        // Reload the list of topics
        this.loadPosts();
      }
    });

    return await modal.present();
  }

  /**
   * show toast
   * @param nameTopic
   * @param position
   * @param color
   */
  async presentToast(nameTopic: string, position: 'bottom', color: string) {
    const toast = await this.toastController.create({
      message: 'Topic ' + nameTopic + " successfully created",
      duration: 1500,
      position: position,
      color: color
    });
    await toast.present();
  }

}
