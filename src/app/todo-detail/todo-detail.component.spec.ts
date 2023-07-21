import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TodoDetailComponent } from './todo-detail.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { mockUserDetails } from '../../mocks/mockUser';
import { mockTodo1, updateMockTodo1 } from '../../mocks/mockTodos';
import { of } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { TodoService } from '../Service/todo.service';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';

describe('TodoDetailComponent navigate to existing todo, when user have an authorization', () => {
  let component: TodoDetailComponent;
  let fixture: ComponentFixture<TodoDetailComponent>;
  let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserProfile']);
  let mockTodoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodo', 'updateTodo']);
  let router: Router;
  let editDe: DebugElement;
  let editEl: HTMLElement;
  //https://stackoverflow.com/questions/53495617/unit-testing-angular-6-location-go-back
  let location: Location;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [TodoDetailComponent],
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [
        //https://stackoverflow.com/questions/65202138/how-do-i-mock-id-this-route-snapshot-params-id-in-angular
        { provide: ActivatedRoute, useValue: { snapshot: { params: { 'id': '649b968009fdb51208802255' } } } },
        { provide: AuthService, useValue: mockAuthService },
        { provide: TodoService, useValue: mockTodoService },
        { provide: Location, useClass: SpyLocation }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    mockAuthService.getUserProfile.and.returnValue(of(mockUserDetails));
    mockTodoService.getTodo.and.returnValue(of(mockTodo1));
    mockTodoService.updateTodo.and.returnValue(of(updateMockTodo1))

    //spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
    spyOn(location, 'back');
    spyOn(router, 'navigate');

    fixture.detectChanges();

    editDe = fixture.debugElement.query(By.css('.edit_Todo'));

   // console.log('editDe', editDe)

    editEl = editDe.nativeElement;

   // console.log('editEl', editEl)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have form, and can be update then back.', () => {

    const title =  editEl.querySelector('#title') as HTMLInputElement;
    const content = editEl.querySelector('#content') as HTMLInputElement;
    const saveBtn = editEl.querySelector('.saveBtn') as HTMLInputElement;
    const backBtn = editEl.querySelector('.backBtn') as HTMLInputElement;

    //console.log('title', title.value);
    //console.log('content', content.value)

    expect(title.value).toEqual("test12 title update")
    expect(content.value).toEqual("test12 content update")
    expect(saveBtn.textContent).toEqual('save');
    expect(backBtn.textContent).toEqual('go back');

    saveBtn.click()

    fixture.detectChanges()

    expect(mockTodoService.updateTodo).toHaveBeenCalled();

    expect(location.back).toHaveBeenCalled();
  });

  it('should have form, and  go back last page.', () => {

    const backBtn = editEl.querySelector('.backBtn') as HTMLInputElement;

    backBtn.click()

    fixture.detectChanges()

    expect(location.back).toHaveBeenCalled();
  });

});

describe('TodoDetailComponent navigate to existing todo, when have not authorized', () => {
  let component: TodoDetailComponent;
  let fixture: ComponentFixture<TodoDetailComponent>;
  // let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserProfile']);
  let mockTodoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodo']);
  let router: Router;
  let detailDe: DebugElement;
  let detailEl: HTMLElement;
  let location: Location;


  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [TodoDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        //https://stackoverflow.com/questions/65202138/how-do-i-mock-id-this-route-snapshot-params-id-in-angular
        { provide: ActivatedRoute, useValue: { snapshot: { params: { 'id': '649b968009fdb51208802255' } } } },
        //    { provide: AuthService, useValue: mockAuthService },
        { provide: TodoService, useValue: mockTodoService },
        { provide: Location, useClass: SpyLocation }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    //  mockAuthService.getUserProfile.and.returnValue(of(mockUserDetails));
    mockTodoService.getTodo.and.returnValue(of(mockTodo1));

    spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
    spyOn(location, 'back');

    fixture.detectChanges();

    detailDe = fixture.debugElement.query(By.css('.todo_detail'));

    //console.log('detailDe', detailDe)

    detailEl = detailDe.nativeElement;

    //console.log('detailEl', detailEl)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title, content, date, and got back button, then click button can back last page. ', () => {

    const title = detailEl.querySelector('.title') as HTMLInputElement;
    const content = detailEl.querySelector('.content') as HTMLInputElement;
    const date = detailEl.querySelector('.date') as HTMLInputElement;
    const backBtn = detailEl.querySelector('.backBtn') as HTMLInputElement;


    expect(title.textContent).toEqual('title: test12 title update Details');
    expect(content.textContent).toEqual('content: test12 content update');
    expect(date.textContent).toEqual('update date: 06/28/23');
    expect(backBtn.textContent).toEqual('go back');

    backBtn.click()

    fixture.detectChanges()

    expect(location.back).toHaveBeenCalled();

  });
})
