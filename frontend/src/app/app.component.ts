import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LanguageService } from './services/app.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'social-detox';
  isEnglish: boolean = false;
  constructor(private router: Router, private languageService: LanguageService) {
    this.languageService.isEnglish$.subscribe((isEnglish) => {
      this.isEnglish = isEnglish;
    });
  }

toggleLanguage() {
    this.languageService.toggleLanguage();  
  }
  
goToChat(){
  this.router.navigate(['/chat']);
}
goToLogin(){
  this.router.navigate(['/login']);
}
goToHome(){
  this.router.navigate(['/'])
}
}
