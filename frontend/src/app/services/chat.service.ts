import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private http: HttpClient) {
    this.currentApiUrl = this.apiEnglishUrl;
  }

  private apiEnglishUrl = 'http://127.0.0.1:5000/detect_insult';
  public apiFrenchUrl = 'https://social-detox-fr-1058119729143.us-central1.run.app/detect-text';
  public currentApiUrl: string = '';
  private apiKey = 'AIzaSyA6fXrzT-8uyYjpETkvYd-zZUHZqDgdcgU';
  private messages: { text: string; sender: string; timestamp: Date; isImage?: boolean }[] = [
    { text: 'Hello!', sender: 'Elghani', timestamp: new Date() },
    { text: 'Comment ça va', sender: 'Elghani', timestamp: new Date() }
  ];
  showPopup: boolean = false;
  popupMessage = '';

  getMessages() {
    return this.messages;
  }

  setLanguage(isEnglish: boolean) {
    this.currentApiUrl = isEnglish ? this.apiEnglishUrl : this.apiFrenchUrl;
  }

  detectInsult(text: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    let body: { text: string; api_key?: string } = { text };

    if (this.currentApiUrl === this.apiFrenchUrl) {
      body.api_key = this.apiKey;
    }

    return this.http.post<any>(this.currentApiUrl, body, { headers });
  }

  addMessage(text: string, sender: string, isImage: boolean = false): Observable<any> {
    if (isImage) {
      // Si c'est une image, on l'ajoute directement sans vérifier
      this.messages.push({ text, sender, timestamp: new Date(), isImage });
      return of({ success: true });
    } else {
      // Vérifie si le texte contient une insulte
      return this.detectInsult(text).pipe(
        map((response) => {
          if (this.currentApiUrl === this.apiFrenchUrl) {
            // Pour l'API française, on vérifie le champ 'is_toxic'
            if (!response.is_toxic) {
              // Le message est acceptable, on l'ajoute à la liste
              this.messages.push({ text: response.filtered_message || text, sender, timestamp: new Date(), isImage });
              return { success: true };
            } else {
              return { success: false, message: response.filtered_message };
            }
          } else if (this.currentApiUrl === this.apiEnglishUrl) {
            // Pour l'API anglaise, on vérifie le score
            if (response[0].score <= 0.7) {
              // Le message est acceptable, on l'ajoute à la liste
              this.messages.push({ text, sender, timestamp: new Date(), isImage });
              return { success: true };
            } else {
              // Le message est trop toxique, on retourne un échec avec un message d'erreur
              return { success: false, message: 'Le message est trop toxique pour être envoyé.' };
            }
          } else {
            return { success: false, message: 'API non supportée.' };
          }
        }),
        catchError((error) => {
          console.error('Erreur lors de la vérification du message:', error);
          return of({ success: false, message: 'Erreur lors de la vérification du message.' });
        })
      );
    }
  }
}
