import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: { text: string; sender: string; timestamp: Date }[] = [
    { text: 'Hello!', sender: 'Bot', timestamp: new Date() },
    { text: 'How can I help you today?', sender: 'Bot', timestamp: new Date() }
  ];

  getMessages() {
    return this.messages;
  }

  addMessage(text: string, sender: string) {
    this.messages.push({ text, sender, timestamp: new Date() });
  }
}
