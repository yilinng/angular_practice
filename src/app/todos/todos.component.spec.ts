import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockTodoArray } from '../../mocks/mockTodos';
import { TodoService } from '../Service/todo.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { of } from 'rxjs';
import { TodoDetailComponent } from '../todo-detail/todo-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;
  let mockTodoService = jasmine.createSpyObj<TodoService>('TodoService', ['getTodos']);
  let router: Router;

  let listDe: DebugElement;
  let listEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodosComponent, TodoDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([{
        path: 'todos/649b968009fdb51208802255', component: TodoDetailComponent}
      ])],
      providers: [
        { provide: TodoService, useValue: mockTodoService },
      ]

    })
      .compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    mockTodoService.getTodos.and.returnValue(of(mockTodoArray));

    fixture.detectChanges();

    listDe = fixture.debugElement.query(By.css('.todoList'));

   // console.log(' listDe', listDe)

    listEl = listDe.nativeElement;

   // console.log('listEl', listEl);


  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render todo list', () => {

    const todos = listEl.children;

    //console.log('firstTodo', todos);

    expect(todos.length).toEqual(3);
    expect(todos[0].children[0].textContent).toEqual(mockTodoArray[0].title as string)

  });

//https://angular.io/guide/testing-components-scenarios#routing-component  
  it('should tell navigate when todo clicked', async() => {

    const firstTodo = listEl.children[0] as HTMLElement;


    await firstTodo.click();

    fixture.detectChanges();

    expect(TestBed.inject(Router).url).toEqual(`/todos/649b968009fdb51208802255`);

  });
  
});


