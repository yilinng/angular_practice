import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../shared/auth.service'
import { RouterTestingModule } from '@angular/router/testing'
import { LoginComponent } from '../components/login/login.component';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  /*
 //https://stackoverflow.com/questions/70018900/how-to-write-a-unit-test-for-angular-routing-with-canactivate-guard
   it('can load instance', () => {
     const routerStubInit = () => ({ navigate: (array: any, object: any) => ({}) });
     TestBed.configureTestingModule({
       providers: [
         AuthGuard,
         HttpClient,
         HttpHandler,
         //https://angular.io/guide/dependency-injection-providers
         { provide: Router, useFactory: routerStubInit },
       ]
     });
     service = TestBed.inject(AuthGuard);
 
     console.log('can load instance guard service', service)
 
     expect(service).toBeTruthy();
   });
 
   describe('canActivate', () => {
     it('makes expected calls 1', () => {
       const authenticationServiceStub = () => ({ userValue: {} });
       const routerStubInit = () => ({
         navigate: (arr: string[], obj: any) => {
           arr = ['log-in'];
           //console.log('makes expected calls 1 navigate', arr);
       } });
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [
           AuthGuard,
           HttpClient,
           HttpHandler,
           { provide: Router, useFactory: routerStubInit },
           { provide: AuthService, useFactory: authenticationServiceStub }
         ]
       });
       service = TestBed.inject(AuthGuard);
 
       const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
       const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
       //spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test')
       //https://stackoverflow.com/questions/41414712/need-some-practical-example-of-callthrough-callfake-in-jasmine
       spyOn(service, 'canActivate').and.callThrough();
       service.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub);
       expect(service.canActivate).toHaveBeenCalled();
     });
 
     it('makes expected calls 2', () => {
       const routerStubInit = () => ({ navigate: (arr: any, obj: any) => ({}) });
       const authenticationServiceStubNull = () => ({ userValue: null });
       TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [
           AuthGuard,
           HttpClient,
           HttpHandler,
           { provide: Router, useFactory: routerStubInit },
           { provide: AuthService, useFactory: authenticationServiceStubNull }
         ]
       });
       service = TestBed.inject(AuthGuard);
 
       const routerStub: Router = TestBed.inject(Router);
       const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
       const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
       spyOn(routerStub, 'navigate').and.callThrough();
       service.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub);
       expect(routerStub.navigate).toHaveBeenCalled();
     });
     
   });
 */
  
//https://stackoverflow.com/questions/53333050/how-to-mock-getter-parameter-value-of-a-mocked-service
//https://stackoverflow.com/questions/55421345/how-to-unit-test-angular-guard-with-observable-subscription-in-constructor
//https://stackoverflow.com/questions/53879869/how-to-unit-test-canactivate-of-angular  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        RouterTestingModule.withRoutes([{ path: 'log-in', component: LoginComponent }])],
    
      providers: [
        AuthGuard,
        AuthService
        //{ provide: AuthService, useValue: authServiceSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService)
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });


  
  it('should navigate to log-in when no authenticated', () => {
    //Arrange
    const authServiceSpy = spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(false)
    const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
    const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
    //Act
    guard.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub);
    // Assert
    expect(authServiceSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['log-in']);
  });

  it('should return true when authenticated', () => {
    //Arrange
    const authServiceSpy = spyOnProperty(authService, 'isLoggedIn', 'get').and.returnValue(true)
    const activatedRouteSnapshotStub: ActivatedRouteSnapshot = <any>{};
    const routerStateSnapshotStub: RouterStateSnapshot = <any>{};
    //Act
    guard.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub);
    // Assert
    expect(authServiceSpy).toHaveBeenCalled();
    expect(guard.canActivate(activatedRouteSnapshotStub, routerStateSnapshotStub)).toEqual(true)
  });
  
});
