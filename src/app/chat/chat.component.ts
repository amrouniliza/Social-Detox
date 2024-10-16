import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { HttpClientModule } from '@angular/common/http'; // Important: Importer HttpClientModule
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';

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

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messages = this.chatService.getMessages();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.addMessage(this.newMessage, 'You');
      this.newMessage = '';
    }
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
