import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TodoEntry, UserEntry } from '../types/types';

import { TodoService } from '../Service/todo.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css']
})
export class TodoDetailComponent implements OnInit {

  todo: TodoEntry | undefined;
  user: UserEntry | undefined;

  constructor(private route: ActivatedRoute, private todoService: TodoService, private authService: AuthService, private location: Location) { }

  ngOnInit(): void {
    this.getTodo()
    this.getUser()
  }

  getUser(): void {
    const id = this.todo?.user
    this.authService.getUserProfile(id).subscribe(user => this.user = user);
  }

  getTodo(): void {
    //console.log('this route', this.route.snapshot.params['id'])
    const id = this.route.snapshot.params['id']//parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.todoService.getTodo(id)
      .subscribe(todo => this.todo = todo);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    console.log('update save', this.todo)

    if (this.todo) {
      this.todoService.updateTodo(this.todo)
        .subscribe(() => this.goBack());
    }

  }


}
