import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';  


@Component({
  selector: 'app-feed',
  standalone: true,  // Si vous utilisez des composants standalone
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent {
  showComments: boolean = false;
  comments: { user: string, text: string }[] = [];
  newComment: string = '';

  likePost() {
    alert('Vous avez aimé cette publication !');
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({ user: 'Utilisateur courant', text: this.newComment });
      this.newComment = ''; // Vider le champ de saisie
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement; // Caste l'event pour obtenir la valeur
    this.newComment = input.value; // Met à jour la nouvelle valeur du commentaire
  }
}