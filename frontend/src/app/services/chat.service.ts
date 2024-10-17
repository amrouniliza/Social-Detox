import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://127.0.0.1:5000/detect_insult';
  private messages: { text: string; sender: string; timestamp: Date; isImage?: boolean }[] = [
    { text: 'Hello!', sender: 'Elghani', timestamp: new Date() },
    { text: 'Comment ça va ', sender: 'Elghani', timestamp: new Date() }
  ];

  getMessages() {
    return this.messages;
  }

  detectInsult(text: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { text };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  addMessage(text: string, sender: string, isImage: boolean = false) {
    if(isImage==false) {
    this.detectInsult(text).subscribe(
      (response) => {
        if (response[0].score <= 0.7) {
          this.messages.push({ text, sender, timestamp: new Date(), isImage });
        } else {
          console.log('Le message est trop toxique pour être envoyé.');
          alert('Le message est trop toxique pour être envoyé.');
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du message:', error);
      }
    ); }else{

      this.messages.push({ text, sender, timestamp: new Date(), isImage });
    }
  }
 
}
