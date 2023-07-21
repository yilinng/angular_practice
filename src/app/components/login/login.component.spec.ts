import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing'
import { Router } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component'
import { AuthService } from '../../shared/auth.service';
import { of } from 'rxjs';
import { mockUser } from 'src/mocks/mockUser';

//https://testing-angular.com/testing-components-depending-on-services/#testing-components-depending-on-services
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginDe: DebugElement;
  let loginEl: HTMLElement;
  //https://stackoverflow.com/questions/68560373/how-to-test-routing-navigation-with-routertestingmodule
  let router: Router;
  //https://stackoverflow.com/questions/69989284/typeerror-cannot-read-properties-of-undefined-reading-subscribe-in-jasmine
  let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['logIn'])

  beforeEach(async () => {
    // make sure you create this spy object with logIn public method to be mocked
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'user-profile', component: UserProfileComponent }])],
      // provide the mock instead of the real one
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    })
      .compileComponents();

    // spy on the navigate method so it doesn't actually want to navigate
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    mockAuthService.logIn.and.returnValue(of(mockUser))

    fixture.detectChanges();
    // find the login's DebugElement and element
    loginDe = fixture.debugElement.query(By.css('.auth-wrapper'));

    loginEl = loginDe.nativeElement;

    spyOn(router, 'navigate');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkValue set to false enables the submit button when input email and password', () => {
    const loginBtn = loginEl.querySelector('.loginBtn') as HTMLInputElement;
    
    component.loginForm.value.email = 'test11@test.com';
    component.loginForm.value.password = 'test11';

    fixture.detectChanges();

    //https://stackoverflow.com/questions/51090293/unit-test-for-button-with-disable
    expect(loginBtn.disabled).toBeFalsy()

    loginBtn.click();

    fixture.detectChanges();

    expect(mockAuthService.logIn).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['user-profile']);

    //https://stackoverflow.com/questions/46335028/expected-spy-navigate-to-have-been-called-with-users-but-it-was-never
  });

  it('checkValue set to true disables the submit button when input email or password', () => {

    component.loginForm.reset()

    const loginBtn = loginEl.querySelector('.loginBtn') as HTMLInputElement;

    // simulate user entering a new email into the input box
    component.loginForm.value.email = 'email@email.com';

    fixture.detectChanges();

    //https://stackoverflow.com/questions/51090293/unit-test-for-button-with-disable
    expect(loginBtn.disabled).toBeTruthy();

  })
});
