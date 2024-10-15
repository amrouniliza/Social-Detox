import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';   

@Component({
  selector: 'app-chat',
  standalone: true,  // Si vous utilisez des composants standalone
  imports: [CommonModule, FormsModule],  // Ajoutez ces imports
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
  messages: { text: string; sender: string; timestamp: Date }[] = [];
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