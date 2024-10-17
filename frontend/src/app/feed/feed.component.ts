import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http'; 
import { FeedService } from '../services/feed.service';
import { HttpClient } from '@angular/common/http';


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
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private feedService: FeedService,
    private http: HttpClient
  ) {}
  ngOnInit() {
      this.comments = this.feedService.getComments();
  }

  showPopup: boolean = false;  // Ajout pour afficher la popup
  newPostText: string = '';
  newPostImage: string = ''; 
  posts: { user: string, text: string, image: string, likes: number }[] = [
    { user: 'User', text: 'Ceci est un exemple de contenu de publication.', image: 'assets/images/chiot.png', likes: 0 } // Remplace par l'URL de l'image de chiot
  ]; // Liste des pub


  // Méthode pour gérer la sélection d'une image
  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result; // Stocke la Data URL de l'image
        this.newPostImage = reader.result as string;  // Utilisez reader.result ici
      };
      reader.readAsDataURL(file);
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
      this.feedService.addMessage(  this.newComment ,'Liza');
      this.newComment = ''; // Vider le champ de saisie
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement; // Caste l'event pour obtenir la valeur
    this.newComment = input.value; // Met à jour la nouvelle valeur du commentaire
  }


  addPost() {
    if (this.newPostText.trim() && this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);  // Ajout du fichier image
      formData.append('api_key', 'AIzaSyA6fXrzT-8uyYjpETkvYd-zZUHZqDgdcgU');  // Ajout de la clé API
  
      this.http.post<any>('https://social-detox-fr-1058119729143.us-central1.run.app/detect-image', formData).subscribe(
        (response) => {
          console.log('response', response)
          if (!response.sensible && this.selectedFile) {
            // L'image n'est pas sensible, vous pouvez la publier
            this.posts.unshift({
              user: 'Test',
              text: this.newPostText,
              image: this.newPostImage,  // Utilisation de la Data URL correcte
              likes: 0
            });
  
            // Réinitialiser les champs après la publication
            this.newPostText = '';
            this.selectedFile = null;
            this.imagePreview = null;
            this.newPostImage = '';
          } else {
            // L'image est sensible
            alert('Votre image est sensible et ne peut pas être publiée.');
          }
        },
        (error) => {
          console.error('Erreur API :', error);
          alert('Une erreur est survenue lors de la vérification de l\'image. Détails : ' + JSON.stringify(error));
        }
      );      
    }
  }
}