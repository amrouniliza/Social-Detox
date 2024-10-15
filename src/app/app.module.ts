import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component'; 
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    FeedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule,
    AppComponent,
    ChatComponent
  ],
  providers: [],
})
export class AppModule { }
