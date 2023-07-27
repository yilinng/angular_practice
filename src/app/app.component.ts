import { Component } from '@angular/core';
//import { AuthService } from './shared/auth.service';
//import { Router } from '@angular/router';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    console.log(environment.production); // Logs false for development environment
   }
}