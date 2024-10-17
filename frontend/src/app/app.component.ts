import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat/chat.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'social-detox';
  constructor(private router : Router){}
  displayChat(){  
    const joinBtn = document.getElementById('joinBtn');
    const chat = document.getElementById('chat');
    const chat2 = document.getElementById('chat2');

    joinBtn?.addEventListener('click', () => {
    if (chat) {
      chat.style.display = 'block';
    }
    if (chat2) {
      chat2.style.display = 'block';
    }

  });
  

  

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
