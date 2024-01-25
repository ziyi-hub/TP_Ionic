import {Component, OnInit} from '@angular/core';
import {PostModalComponent} from "../components/post-modal/post-modal.component";
import {PostService} from "../services/post.service";
import {ModalController} from "@ionic/angular";
import {Post} from '../models/post';

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.page.html',
  styleUrls: ['./topic-detail.page.scss'],
})
export class TopicDetailPage implements OnInit {
  posts: Post[] = [];

  constructor(
    private postService: PostService,
    private modalController: ModalController,
  ) { }

  /**
   * Charger les topics lors de l'initialisation de la page
   */
  ngOnInit() {
    this.loadTopics();
  }

  /**
   * Utiliser le service pour récupérer tous les topics
   */
  loadTopics() {
    this.posts = this.postService.getAll();
  }

  /**
   * Ouvrir fenetre Modal
   */
  // async openModal() {
  //   const modal = await this.modalController.create({
  //     component: PostModalComponent,
  //   });
  //
  //   modal.onDidDismiss().then((data) => {
  //     // console.log(data);
  //     if (!!data && data.data) {
  //
  //     }
  //   });
  //
  //   return await modal.present();
  // }

}
