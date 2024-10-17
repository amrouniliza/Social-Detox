import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://127.0.0.1:5000/detect_insult';
  private comments: { user: string, text: string }[] = [
    { user: 'Alice', text: 'Super post !' },
    { user: 'Bob', text: 'Très intéressant, merci pour le partage !' }
  ];
  getComments() {
    return this.comments
    }


  detectInsult(text: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { text };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

  addMessage(text: string, user: string, ) {
    this.detectInsult(text).subscribe(
      (response) => {
        if (response[0].score <= 0.7) {
          this.comments.push({ text, user});
        } else {
          console.log('Le message est trop toxique pour être envoyé.');
          alert('Le message est trop toxique pour être envoyé.');
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du message:', error);
      }
    ); }
  }
 