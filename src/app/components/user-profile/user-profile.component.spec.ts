import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserProfileComponent } from './user-profile.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { AuthService } from '../../shared/auth.service'
import { TodoService } from '../../Service/todo.service';
import { mockTodoArrayWithSameUser, addMockTodo } from '../../../mocks/mockTodos';
import { mockUserDetails } from '../../../mocks/mockUser';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TodoDetailComponent } from 'src/app/todo-detail/todo-detail.component';


describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['getUserProfile']);
  let mockTodoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodos', 'addTodo', 'deleteTodo']);
  let router: Router;
  let profileDe: DebugElement;
  let profileEl: HTMLElement;

  //https://stackoverflow.com/questions/53495617/unit-testing-angular-6-location-go-back
  let location: Location;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule,
        RouterTestingModule.withRoutes([{
          path: 'todos/649b968009fdb51208802255', component: TodoDetailComponent}
        ])],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TodoService, useValue: mockTodoService },
      ]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    //spyOn(Storage.prototype, 'getItem').withArgs('access_token').and.returnValue('test');
    let id = '649adaa22f7aaa10a87e8c31';
    spyOn(Storage.prototype, 'getItem').withArgs('user_id').and.returnValue(id);

    spyOn(router, 'navigate');

    mockAuthService.getUserProfile.and.returnValue(of(mockUserDetails));
    mockTodoService.getTodos.and.returnValue(of(mockTodoArrayWithSameUser));
    mockTodoService.addTodo.and.returnValue(of(addMockTodo))
    mockTodoService.deleteTodo.and.returnValue(of(addMockTodo))

    fixture.detectChanges();

    profileDe = fixture.debugElement.query(By.css('.user_detail'));

   // console.log('profileDe', profileDe);

    profileEl = profileDe.nativeElement;

   // console.log('profileEl', profileEl)

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show user details and user's todos and todoList button`, () => {
    const details = profileEl.querySelector('.detail');

    expect(details?.children[0].textContent).toEqual('user detail');
    expect(details?.children[1].textContent).toEqual(`name: ${component.currentUser?.name}`);
    expect(details?.children[2].textContent).toEqual(`email: ${component.currentUser?.email}`);

    const todoList = profileEl.querySelector('.todoList');

    console.log('todoList', todoList);
    //button list
    expect(todoList?.children[0].children[1].children[0].textContent).toEqual('Add Todo + ');
    expect(todoList?.children[0].children[1].children[1].textContent).toEqual('Show user detail ')
    //count number of todos
    expect(todoList?.children[1].children.length).toEqual(component.currentUser?.todos?.length)
    //delete button
    expect(todoList?.children[1].children[0].children[1].textContent).toEqual('delete todo X')

  });

  it(`should show user form  when user click add todo button`, () => {

    fixture.debugElement.query(By.css('.addBtn')).nativeElement.click();

    fixture.detectChanges();

    expect(component.clickTodo).toBe(true)
    expect(component.showUser).toBe(false)

    expect(fixture.debugElement.query(By.css('.user_Form'))).toBeTruthy()
  });

  it(`should add new todo, when click submit button `, () => {

    fixture.debugElement.query(By.css('.addBtn')).nativeElement.click();

    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(By.css('.submitBtn')).nativeElement;

    expect(fixture.debugElement.query(By.css('.user_Form'))).toBeTruthy();

    component.addTodoForm.value.title = 'test12 addMockTodo'
    component.addTodoForm.value.content = 'test12 content addMockTodo'

    fixture.detectChanges();

    expect(submitBtn.disable).toBeFalsy();

    submitBtn.click()

    fixture.detectChanges();

    expect(mockTodoService.addTodo).toHaveBeenCalled();
  });

  it(`should reset todo form, when click new Todo button `, () => {

    fixture.debugElement.query(By.css('.addBtn')).nativeElement.click();

    fixture.detectChanges();

    const newBtn = fixture.debugElement.query(By.css('.newBtn')).nativeElement;

    expect(fixture.debugElement.query(By.css('.user_Form'))).toBeTruthy();

    newBtn.click()

    fixture.detectChanges();

    expect(component.addTodoForm.value.title).toBe(null)
    expect(component.addTodoForm.value.content).toBe(null)

  });

  it(`should show user information when user click Show user detail after user click Add todo button `, () => {

    fixture.debugElement.query(By.css('.addBtn')).nativeElement.click();

    fixture.detectChanges();

    expect(component.clickTodo).toBe(true)
    expect(component.showUser).toBe(false)

    fixture.debugElement.query(By.css('.showBtn')).nativeElement.click();

    fixture.detectChanges();

    expect(component.clickTodo).toBe(false)
    expect(component.showUser).toBe(true)

  });

  //https://stackoverflow.com/questions/29945075/how-would-i-test-window-prompts-and-confirms-with-karma-jasmine
  it(`should delete todo when user click delete todo button`, () => {
    //https://jasmine.github.io/api/edge/Spy.html
    spyOn(window, 'confirm').and.returnValue(true);

    const deleteBtn = fixture.debugElement.query(By.css('.deleteBtn')).nativeElement;

    deleteBtn.click()

    fixture.detectChanges();

    expect(mockTodoService.deleteTodo).toHaveBeenCalled()

  });

  it('should navigate to todo details page', fakeAsync(() => {

    fixture.debugElement.query(By.css('a')).nativeElement.click();

    tick();

    expect(location.path()).toBe('/todos/649b968009fdb51208802255');
  }))

});
