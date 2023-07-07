import { Component, OnInit } from '@angular/core';

import { TodoEntry } from '../types/types';

import { TodoService } from '../Service/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todos: TodoEntry[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodos()
  }

  getTodos(): void {
    this.todoService.getTodos().subscribe((todos) => (this.todos = todos));
  }

}
