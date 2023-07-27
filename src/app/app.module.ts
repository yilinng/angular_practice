import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { CommonModule } from '@angular/common';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeroesComponent } from './heroes/heroes.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // <-- NgModel lives here

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/authconfig.interceptor';
//import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './in-memory-data.service';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { TodosComponent } from './todos/todos.component';
import { TodoSearchComponent } from './todo-search/todo-search.component';
import { BannerComponent } from './components/banner/banner.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { ServerErrorInterceptor } from './shared/ServerErrorInterceptor';
import { CustomDirective } from './Directive/custom.directive'
import { AdDirective } from './Directive/ad.directive';

@NgModule({
    declarations: [
        AppComponent,
        HeroesComponent,
        HeroDetailComponent,
        MessagesComponent,
        DashboardComponent,
        HeroSearchComponent,
        LoginComponent,
        SignupComponent,
        UserProfileComponent,
        TodoDetailComponent,
        TodosComponent,
        TodoSearchComponent,
        BannerComponent,
        PagenotfoundComponent,
        CustomDirective,
        AdDirective,
    ],
    //https://medium.com/front-end-weekly/understanding-angular-http-interceptors-67078b2fcc0b
    //https://dev.to/this-is-angular/angular-error-interceptor-12bg?comments_sort=latest
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        // CommonModule,
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
    ]
})

export class AppModule {

}
