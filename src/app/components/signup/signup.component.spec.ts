import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { SignupComponent } from './signup.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'
import { LoginComponent } from '../login/login.component'
import { AuthService } from '../../shared/auth.service';
import { of } from 'rxjs';
import { mockUser, mockEmails } from 'src/mocks/mockUser';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let signupDe: DebugElement;
  let signupEl: HTMLElement;
  //https://stackoverflow.com/questions/68560373/how-to-test-routing-navigation-with-routertestingmodule
  let router: Router;
  //https://stackoverflow.com/questions/69989284/typeerror-cannot-read-properties-of-undefined-reading-subscribe-in-jasmine
  let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['signUp', 'getEmail'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'log-in', component: LoginComponent }])
      ],
      // provide the mock instead of the real one
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    mockAuthService.getEmail.and.returnValue(of(mockEmails))
    mockAuthService.signUp.and.returnValue(of(mockUser))

    // simulate user entering a new input into the input box
    component.signupForm.value.name = 'test name';
    component.signupForm.value.email = 'email@email.com';
    component.signupForm.value.password = 'password';
    fixture.detectChanges();

    // find the login's DebugElement and element
    signupDe = fixture.debugElement.query(By.css('.auth-wrapper'));

    signupEl = signupDe.nativeElement;

    spyOn(router, 'navigate');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkValue set to false enables the submit button when input name, email and password', () => {

    const signupBtn = signupEl.querySelector('.signupBtn') as HTMLInputElement;

    // simulate user entering a new email into the input box
    component.signupForm.value.name = 'test name';
    component.signupForm.value.email = 'email@email.com';
    component.signupForm.value.password = 'password';

    fixture.detectChanges();

    //https://stackoverflow.com/questions/51090293/unit-test-for-button-with-disable
    expect(signupBtn.disabled).toBeFalsy()

    signupBtn.click()

    //https://stackoverflow.com/questions/46335028/expected-spy-navigate-to-have-been-called-with-users-but-it-was-never
    expect(router.navigate).toHaveBeenCalledWith(['log-in']);

  })

  it('checkValue set to true disables the submit button when input name, email, password length less than 5', () => {

    component.signupForm.reset()

    const signupBtn = signupEl.querySelector('.signupBtn') as HTMLInputElement;

    // simulate user entering a new email into the input box
    component.signupForm.value.name = 'test name';
    component.signupForm.value.email = 'email@email.com';
    component.signupForm.value.password = 'pass';

    fixture.detectChanges();

    //https://stackoverflow.com/questions/51090293/unit-test-for-button-with-disable
    expect(signupBtn.disabled).toBeTruthy();

  })

});
