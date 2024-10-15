import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

import { CommonModule } from '@angular/common';  // Import nécessaire pour ngClass
import { FormsModule } from '@angular/forms';    // Import nécessaire pour ngModel

@Component({
  selector: 'app-chat',
  standalone: true,  // Si vous utilisez des composants standalone
  imports: [CommonModule, FormsModule],  // Ajoutez ces imports
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  messages: { text: string; sender: string }[] = [];
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
}