import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { TodosComponent } from 'src/app/todos/todos.component';
import { SignupComponent } from '../signup/signup.component';
import { Location } from '@angular/common';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AuthService } from 'src/app/shared/auth.service';
import { of } from 'rxjs';
import { mockUserDetails } from '../../../mocks/mockUser';


describe('BannerComponent which  have an authorization', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>
  let router: Router;
  let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserProfile', 'doLogout']);
  let location: Location;
 // let authService: AuthService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'log-in', component: LoginComponent },
          { path: 'todos', component: TodosComponent },
          { path: 'user-profile', component: UserProfileComponent }
        ])
      ],
      // provide the mock instead of the real one
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    });

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);


    let id = '649adaa22f7aaa10a87e8c31';
    //spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
    component.isLoggedIn = true
    //spyOn(Storage.prototype, 'getItem').withArgs('user_id').and.returnValue(id);
    spyOn(router, 'navigate');

    mockAuthService.getUserProfile.and.returnValue(of(mockUserDetails));
    mockAuthService.doLogout.and.returnValue(of({ message: 'logout success' }))

    //https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
    //https://jasmine.github.io/api/edge/Spy.html
    //https://baldur.gitbook.io/angular/angular-test/testing/angular-testing/spyon

    fixture.detectChanges();// trigger initial data binding

  });

  it('should create the app', () => {

    expect(component).toBeDefined();
  });

  //https://stackoverflow.com/questions/61046045/angular-routerlink-routes-wrong-in-test
  it('should show navbar todoList, User Profile, Logout. ', () => {
    //Arrange

    const navEl = fixture.debugElement.query(By.css('.navbar')).nativeElement;

    expect(navEl.children[0].textContent).toEqual('todoList');
    expect(navEl.children[1].textContent).toEqual('User Profile');
    expect(navEl.children[2].textContent).toEqual('Logout');
  });


  it('should navigate to todos page.', fakeAsync(() => {

    fixture.debugElement.query(By.css('.todoList')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/todos');

  }));

  it('should navigate to user-profile page.', fakeAsync(() => {

    fixture.debugElement.query(By.css('.user-profile')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/user-profile');
  }));


  
  it('click logout button navigate to log-in page.', () => {

    const logoutBtn = fixture.debugElement.query(By.css('.logoutBtn')).nativeElement;

    logoutBtn.click();

    fixture.detectChanges();


    expect(mockAuthService.doLogout).toHaveBeenCalled();

    expect(router.navigate).toHaveBeenCalledWith(['log-in']);

  });
  

});

describe('BannerComponent, when user not authorized', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'log-in', component: LoginComponent },
        { path: 'todos', component: TodosComponent },
        { path: 'sign-up', component: SignupComponent },
      ])],
      declarations: [
        BannerComponent
      ],
    });
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    //https://stackoverflow.com/questions/11485420/how-to-mock-localstorage-in-javascript-unit-tests
    fixture.detectChanges();

    spyOn(router, 'navigate');

  });

  it('should create the app', () => {
    expect(component).toBeDefined();
  });

  it('should show navbar todoList, login, signup', () => {

    const bannerDe: DebugElement = fixture.debugElement;
    const navbarDe = bannerDe.query(By.all());
    const nav: HTMLElement = navbarDe.nativeElement;
    //  console.log('nav ', nav, nav.children)
    expect(nav.children[1].children[0].textContent).toEqual('todoList');
    expect(nav.children[2].children[0].textContent).toEqual('Sign up');
    expect(nav.children[2].children[1].textContent).toEqual('Sign in');
  });

  it('should navigate to todos page.', fakeAsync(() => {

    fixture.debugElement.query(By.css('.todoList')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/todos');

  }));

  it('should navigate to sign-up page.', fakeAsync(() => {

    fixture.debugElement.query(By.css('.sign-up')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/sign-up');

  }));

  it('should navigate to log-in page.', fakeAsync(() => {

    fixture.debugElement.query(By.css('.sign-in')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/log-in');

  }));

})

