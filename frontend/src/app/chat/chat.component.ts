import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { HttpClientModule } from '@angular/common/http'; // Important: Importer HttpClientModule
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../services/app.service';

@Component({
  selector: 'app-chat',
  standalone: true, // Composant standalone
  imports: [CommonModule, FormsModule, HttpClientModule], // Assurez-vous que HttpClientModule est ici
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService] // Assurez-vous que le service est fourni ici
})
export class ChatComponent {
  messages: { text: string; sender: string; timestamp: Date; isImage?: boolean }[] = [];
  newMessage = '';
  isEnglish: boolean = true;
  popupMessage = '';
  showPopup = false;

  constructor(public chatService: ChatService, private languageService: LanguageService) {}

  ngOnInit() {
    this.messages = this.chatService.getMessages();
    this.languageService.isEnglish$.subscribe((isEnglish) => {
      this.isEnglish = isEnglish;
      this.chatService.setLanguage(isEnglish); // Bascule l'API dans le service ChatService
    });
  }

  // Getter pour accéder à currentApiUrl du service
  get currentApiUrl() {
    return this.chatService.currentApiUrl;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      console.log('addMessage', this.newMessage);
      this.chatService.addMessage(this.newMessage, 'You', false).subscribe(
        (result) => {
          console.log('result', result);
          if (!result.success) {
            this.popupMessage = result.message; // Affiche le message d'erreur
            this.showPopup = true;
          } else {
            this.newMessage = '';
          }
        },
        (error) => {
          console.error('Erreur lors de l\'envoi du message:', error);
        }
      );
    }
  }

  closePopup() {
    this.showPopup = false; // Ferme la popup
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.chatService.addMessage(reader.result as string, 'You', true);
      };
      reader.readAsDataURL(file);
    }
  }
}
