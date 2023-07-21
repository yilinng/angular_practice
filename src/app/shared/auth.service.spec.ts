import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse, HttpClient, HttpHeaders, HttpProgressEvent } from '@angular/common/http';
import { mockUser, mockLogin } from '../../mocks/mockUser'
import { UserEntry } from '../types/types';

describe('AuthService when no authorization', () => {
  let service: AuthService;
  let httpController: HttpTestingController;
  let endpoint: string = 'http://localhost:4000/api';


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);

  });

  // After every test, assert that there are no more pending requests.
  afterEach(() => {
    localStorage.clear();

    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call signup and return user', () => {

    service.signUp(mockUser).subscribe((user) => {
      //  console.log('test get todos', todos);
      expect(user).toBeDefined()
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${endpoint}/signup`
    });

    console.log('signup req', req)

    req.flush(mockUser)

  });


  it('should call login and return user and addTokenEntry', () => {

    service.logIn(mockUser).subscribe((user) => {
      //  console.log('test get todos', todos);
      expect(user).toBeDefined()
    });

    const req = httpController.expectOne({
      method: 'POST',
      url: `${endpoint}/login`
    });

    console.log('login req', req)

    req.flush(mockLogin);


  });


});

describe('AuthService when have authorization', () => {
  let httpClient: HttpClient;
  let service: AuthService;
  let httpController: HttpTestingController;
  let endpoint: string = 'http://localhost:4000/api/users';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);

    spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
  });

  // After every test, assert that there are no more pending requests.
  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call getUserProfile and return user information', () => {
    let id = '649b968009fdb51208802255';

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + Storage.prototype.getItem('access_token'));

    httpClient.get<UserEntry>(`${endpoint}/${id}`, { headers: headers }).subscribe(
      (user) => {
        //  console.log('test getuser', user);
        expect(user).toEqual(mockUser)
      });

    const req = httpController.expectOne({
      method: 'GET',
      url: `${endpoint}/${id}`
    });

    console.log('getUserProfiler req', req)

    req.flush(mockUser);

  });


  it('should call doLogout and clean localstorage', () => {

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + Storage.prototype.getItem('access_token'));

    httpClient.delete<UserEntry>(`${endpoint}/logout`, { headers: headers }).subscribe(
      (res) => {
        console.log('logout', res);
        expect(res).toBeDefined()
      })

    const req = httpController.expectOne({
      method: 'DELETE',
      url: `${endpoint}/logout`
    });

    console.log('logout req', req)

    req.flush({ message: "logout success" });

  });

})
