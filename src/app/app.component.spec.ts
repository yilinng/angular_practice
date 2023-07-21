import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BannerComponent } from './components/banner/banner.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { MessagesComponent } from './messages/messages.component';
import { Component, DebugElement, NgZone, NO_ERRORS_SCHEMA } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink, provideRouter, Router } from '@angular/router';

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {
}
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerLinks: RouterLink[];
  let linkDes: DebugElement[];
  let router: Router;
  let ngZone: NgZone;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, BannerComponent, MessagesComponent, RouterOutletStubComponent],
      imports: [HttpClientTestingModule, RouterLink],
      providers: [provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    ngZone = TestBed.inject(NgZone);
    location = TestBed.inject(Location);


    fixture.detectChanges();// trigger initial data binding

     // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));
    console.log('linkDes', linkDes)
    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLink));
    console.log('routerLinks', routerLinks)

  });

  it('should create', () => {
   // console.log('app component', component)
    expect(component).toBeTruthy();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).withContext('should have 1 routerLinks').toBe(1);
  });

  //https://stackoverflow.com/questions/53645534/navigation-triggered-outside-angular-zone-did-you-forget-to-call-ngzone-run
  
})

