import { TopicService } from 'src/app/services/topic.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilitiesMixin } from 'src/app/mixins/utilities-mixin';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { addIcons } from 'ionicons';
import { caretBack } from 'ionicons/icons';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PostDetailPage extends UtilitiesMixin implements OnInit {
  
  
  private readonly route = inject(ActivatedRoute);
  private readonly topicService = inject(TopicService);
  post : Post  | undefined ;
  topicId : string | undefined ;
  ngOnInit() {
    this.getCurrentPost()
  }
  getCurrentPost(){
    this.subscription  =  this.route.params.subscribe(params => {
      this.topicId = params['topicId'];
      const postId = params['id'];
      this.subscription  =  this.topicService.getPost(this.topicId!, postId).subscribe(
        post => {
          if(post){
            this.post = post;
          }
        });
    }
    );

  }
}
addIcons({
  'caret-back': caretBack
});

