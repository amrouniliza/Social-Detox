import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';


@NgModule({
  declarations: [
    
    FeedComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppComponent,
    CommonModule
  ],
  providers: [],
  // bootstrap: [AppComponent]
})
export class AppModule { }
