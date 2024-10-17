import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Utilisation de BehaviorSubject pour observer les changements de langue
  private isEnglishSubject = new BehaviorSubject<boolean>(true);
  isEnglish$ = this.isEnglishSubject.asObservable();

  // Basculer la langue
  toggleLanguage() {
    const currentLang = this.isEnglishSubject.value;
    this.isEnglishSubject.next(!currentLang);
  }

  // Récupérer l'état actuel de la langue
  setLanguage(isEnglish: boolean) {
    this.isEnglishSubject.next(isEnglish);
  }
}
