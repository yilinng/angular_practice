import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    
  }
  ngOnInit() {
  }

  checkValue() {
    if (this.loginForm.value.email && this.loginForm.value.password) {
      return false
    }
    return true
  }


  loginUser() {
    this.authService.logIn(this.loginForm.value);
    this.loginForm.reset()
  }

}
