import { Component, OnInit } from '@angular/core';
import { TodoEntry } from '../types/types';
import { TodoService } from '../Service/todo.service';

/*
export const DATA = new InjectionToken<string>('data', {
  factory: () => 'toto',
});

//https://dev.to/this-is-angular/stop-being-scared-of-injectiontokens-2406
export const NUMBER = new InjectionToken<number>('number');

export const getNumberProvider = (num: number): ValueProvider => ({
  provide: NUMBER,
  useValue: num
});
*/
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

 // num = inject(NUMBER);
  todos: TodoEntry[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodos();
  }

  getTodos(): void {
    this.todoService.getTodos()
      .subscribe(todos => this.todos = todos.slice(0, 5));
  }
}