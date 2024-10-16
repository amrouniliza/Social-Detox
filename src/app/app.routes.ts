import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { JoinComponent } from './join/join.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
{
    path: '',
    component: FeedComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'join',
    component: JoinComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
