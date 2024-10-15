// feed.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  posts = [
    {
      title: 'Publication 1',
      content: 'Ceci est le contenu de la publication 1',
      likes: 0,
      comments: []
    },
    {
      title: 'Publication 2',
      content: 'Ceci est le contenu de la publication 2',
      likes: 0,
      comments: []
    }
  ];
  newComment: string = '';

  ngOnInit(): void {}

  likePost(post: any) {
    post.likes += 1;
  }

  addComment(post: any) {
    if (this.newComment.trim()) {
      post.comments.push(this.newComment);
      this.newComment = '';
    }
  }
}
