import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: { text: string; sender: string }[] = [
    { text: 'Hello!', sender: 'Bot' },
    { text: 'How can I help you today?', sender: 'Bot' }
  ];

  getMessages() {
    return this.messages;
  }

  addMessage(text: string, sender: string) {
    this.messages.push({ text, sender });
  }
}
