import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoSearchComponent } from './todo-search.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService } from '../Service/todo.service';
import { of } from 'rxjs';
import { mockSearchTodoArray, mockTodoArray } from '../../mocks/mockTodos';

//https://stackoverflow.com/questions/58117430/how-to-test-an-observable-stream
describe('TodoSearchComponent', () => {
  let component: TodoSearchComponent;
  let fixture: ComponentFixture<TodoSearchComponent>;
  let mocktodoService = jasmine.createSpyObj<TodoService>('TodoService', ['searchTodos']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodoSearchComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TodoService, useValue: mocktodoService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TodoSearchComponent);
    component = fixture.componentInstance;
    mocktodoService.searchTodos.and.returnValue(of(mockSearchTodoArray));
    component.todos$ = of(mockTodoArray);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should input search ,then display match todos', () => {

    const mySpy = spyOn(component, 'search').withArgs('test1').and.callThrough();

    component.search('test1');

    fixture.detectChanges();

    expect(mySpy).toHaveBeenCalled();

  });

});
