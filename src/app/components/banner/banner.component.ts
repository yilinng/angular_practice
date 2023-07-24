import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service'
import { Router } from '@angular/router';
import { UserEntry } from 'src/app/types/types';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  currentUser: UserEntry | undefined;

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }

  
  getUser(): void {
    let id = localStorage.getItem('user_id');

    this.authService.getUserProfile(id)
      .subscribe((res) => this.currentUser = res);
  }

  logout() {
    this.authService.doLogout().subscribe(res => {
      console.log('logout success subscribe res.', res);
      this.router.navigate(['log-in']);
    })
  }
}
