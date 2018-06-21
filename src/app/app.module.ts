import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import{HttpClientModule, HTTP_INTERCEPTORS}from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import { HomeComponent } from './layout/home/home.component';
import { NavigationComponent } from './layout/navigation/navigation.component';

import { LoginComponent } from './auth/login/login.component';
import {AuthService} from './auth/auth.service';
import{CookieService} from 'ngx-cookie-service';
import{AuthGuard} from './auth/auth.guard';
import {AuthinterceptorService} from './auth/authinterceptor.service';
import { RegisterComponent } from './auth/register/register.component';
import { PostComponent } from './post/post.component';
import {PostService} from './auth/post.service';
import { ListComponent } from './post/list/list.component';
import { EditComponent } from './post/edit/edit.component';
import { UserpostComponent } from './post/userpost/userpost.component';
@NgModule({
  declarations: [
    AppComponent,
   
    HomeComponent,
    NavigationComponent,
    LoginComponent,

    RegisterComponent,
    PostComponent,
    ListComponent,
    EditComponent,
    UserpostComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  FormsModule,
  HttpClientModule,
  RouterModule.forRoot([
    {path:"home", component:HomeComponent, canActivate:[AuthGuard]},
 
   {path:"listpost",component:ListComponent,canActivate:[AuthGuard]},
   {path:"register",component:RegisterComponent},
   {path:"post",component:PostComponent,canActivate:[AuthGuard] },
   {path:"edit-post/:id",component:EditComponent,canActivate:[AuthGuard] },
   {path:"user-post/:id",component:UserpostComponent,canActivate:[AuthGuard] },
    {path:"login",component:LoginComponent},
    {path:"", redirectTo:"home",pathMatch:"full"},
  

  ])
  ],
  providers: [PostService, AuthService, CookieService, AuthGuard,{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthinterceptorService,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
