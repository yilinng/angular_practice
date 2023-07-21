import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {

  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.doLogout().subscribe(res => {
      console.log('logout success subscribe res.', res);
      this.router.navigate(['log-in']);
    })
  }
}
