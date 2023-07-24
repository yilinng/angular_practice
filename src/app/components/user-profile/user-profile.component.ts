import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/auth.service';
import { TodoService } from 'src/app/Service/todo.service';
import { UserEntry, TodoEntry } from '../../types/types';
//import { map, filter } from 'rxjs/operators'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  currentUser: UserEntry | undefined;
  todos: TodoEntry[] = [];
  clickTodo: Boolean = false;
  showUser: Boolean = true;

  addTodoForm: FormGroup;

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    private actRoute: ActivatedRoute,
    public fb: FormBuilder,
  ) { 
    this.addTodoForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      user: [this.currentUser && this.currentUser.id, Validators.required]
    });
  }
  ngOnInit() {
    this.getUser();
    this.getTodos();
  }

  getUser(): void {
    let id = localStorage.getItem('user_id');

   // console.log('getUser id', id);

    this.authService.getUserProfile(id)
      .subscribe((res) => this.currentUser = res);
  }

  getTodos() {
    return this.todoService.getTodos().subscribe((data) => {

      const filteredTodos = data.filter(todo => this.currentUser && this.currentUser.todos?.includes(todo.id))
     // console.log('filteredTodos', filteredTodos)
      this.todos = filteredTodos
    })
  }

  submitted = false;

  onSubmit() {
    this.submitted = true;
    this.todoService.addTodo(this.addTodoForm.value).subscribe((todo) => this.todos.push(todo));
  }

  delete(todo: TodoEntry): void {
    if (window.confirm('Want to delete?')) {
      this.todos = this.todos.filter((h) => h !== todo);
     // console.log('hero delete', todo)
      this.todoService.deleteTodo(todo).subscribe();
    }

  }

  showTodo() {
    this.showUser = false
    this.clickTodo = true
  }

  clickUser() {
    this.clickTodo = false
    this.showUser = true
  }

  checkValue() {
    if (this.addTodoForm.value.title && this.addTodoForm.value.content) {
      return false
    }
    return true
  }

  newTodo() {
    this.addTodoForm.reset()
  }


}
