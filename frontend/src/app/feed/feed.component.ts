import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { FeedService } from '../services/feed.service';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-feed',
  standalone: true,  // Si vous utilisez des composants standalone
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  providers: [FeedService]
})
export class FeedComponent {
  currentDate: Date = new Date();
  showComments: boolean = false;
  comments: { user: string, text: string }[] = [];
  newComment: string = '';
  constructor(private feedService: FeedService) {}
  ngOnInit() {
      this.comments = this.feedService.getComments();
  }

  showPopup: boolean = false; 
  popupFeed = '' // Ajout pour afficher la popup
  newPostText: string = '';
  newPostImage: string = ''; 
  posts: { user: string, text: string, image: string, likes: number }[] = [
    { user: 'User', text: 'Ceci est un exemple de contenu de publication.', image: 'assets/images/chiot.png', likes: 0 } // Remplace par l'URL de l'image de chiot
  ]; // Liste des pub


  // Méthode pour gérer la sélection d'une image
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPostImage = e.target.result; // Mettre à jour le chemin de l'image avec le résultat
      };
      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    }
  }

  // Fermer la popup
  closePopup() {
    this.showPopup = false;
  }

  likePost(index: number) {
    this.posts[index].likes++; // Incrémente le nombre de "J'aime" pour la publication donnée
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment() {
  if (this.newComment.trim()) {
    this.feedService.addMessage(this.newComment, 'Liza').subscribe(
      (result) => {
        if (result.success) {
          this.newComment = ''; // Vider le champ de saisie
        } else {
          this.showPopup = true; // Afficher la popup si le commentaire est vide
          this.popupFeed = result.message; // Mettre à jour le message de la popup
        }
      },
      (error) => {
        console.error("Erreur lors de l'ajout du commentaire:", error);
      }
    );
  }
}

  onInput(event: Event) {
    const input = event.target as HTMLInputElement; // Caste l'event pour obtenir la valeur
    this.newComment = input.value; // Met à jour la nouvelle valeur du commentaire
  }


  addPost() {
    if (this.newPostText.trim() && this.newPostImage.trim()) {
      this.posts.unshift({ user: 'Vlad', text: this.newPostText, image: this.newPostImage , likes: 0});
      this.newPostText = ''; // Réinitialiser le champ texte
      this.newPostImage = ''; // Réinitialiser le champ image
    }
  }
}