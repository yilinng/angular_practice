import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './../../shared/auth.service';
import { Router } from '@angular/router';
import { forbiddenEmailValidator, validMail } from '../../shared/forbidden-email.drective'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  emails: string[] = [];

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    //https://dev.to/angular/reactive-forms-in-angular-350n
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit() { 
    this.findEmail()
  }


  checkValue() {
    if (this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password) {
      if (this.signupForm.value.name.length > 5 && this.signupForm.value.password.length > 5 &&  this.matchEmail() && this.checkEmail()) {
        return false
      }
    }
    return true
  }

  findEmail() {
    this.authService.getEmail().subscribe((res) => {
      //console.log(res)
      this.emails = res.email
    })
  }

  checkEmail() {
    const emails = this.emails;
    
    if (emails.length && emails.includes(this.signupForm.value.email)) {
      return false
    }
    return true
  }

  matchEmail() {
    if (validMail(this.signupForm.value.email)) {
     return true   
    }
    return false
  }

  registerUser() {
     // Create observer object
     const myObserver = {
      next: (x: object) => { console.log('Observer got a next value: ' + x); this.router.navigate(['log-in']) },
      error: (err: Error) => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
     };
    
    this.authService.signUp(this.signupForm.value).subscribe((res) => {
      this.signupForm.reset();
      console.log('signup success', res);
      this.router.navigate(['log-in']); 
    });
  }

  
}