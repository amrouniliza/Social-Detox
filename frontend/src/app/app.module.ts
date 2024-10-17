import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component'; 
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    
  ],
  exports: [RouterModule],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    RouterModule,
    HttpClientModule,
    
    AppComponent,
    FeedComponent,
    ChatComponent
  ],
  providers: [],
})
export class AppModule { }
