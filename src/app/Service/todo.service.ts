import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TodoEntry, NewTodoEntry } from '../types/types';
import { MessageService } from '../message.service'
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  endpoint: string = 'http://localhost:4000/api/todos';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + this.getToken())

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getTodos() {
    return this.http.get<TodoEntry[]>(this.endpoint)
      .pipe(
        tap(_ => this.log(`fetched todos`)),
        catchError(this.handleError<TodoEntry[]>(`fetch todos fails`)))
  }

   /** GET todo by id. Return `undefined` when id not found */
   getTodoNo404<Data>(id: string): Observable<TodoEntry> {
    const url = `${this.endpoint}/?id=${id}`;
    return this.http.get<TodoEntry[]>(url)
      .pipe(
        map(todos => todos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} todo id=${id}`);
        }),
        catchError(this.handleError<TodoEntry>(`getTodo id=${id}`))
      );
  }

  /** GET todo by id. Will 404 if id not found */
  getTodo(id: string): Observable<TodoEntry> {
    const url = `${this.endpoint}/${id}`;
    return this.http.get<TodoEntry>(url).pipe(
      tap(_ => this.log(`fetched todo id=${id}`)),
      catchError(this.handleError<TodoEntry>(`getTodo id=${id}`))
    );
  }

    //////// Save methods //////////

  /** POST: add a new todo to the server */
  addTodo(todo: TodoEntry): Observable<TodoEntry> {
    return this.http.post<TodoEntry>(this.endpoint, todo, { headers: this.headers }).pipe(
      tap((newTodo: TodoEntry) => this.log(`added todo w/ id=${newTodo[`id`]}`)),
      catchError(this.handleError<TodoEntry>('addTodo'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteTodo(todo: TodoEntry): Observable<TodoEntry> {
    return this.http.delete<TodoEntry>(`${this.endpoint}/${todo.id}`,{ headers: this.headers }).pipe(
      tap(_ => this.log(`deleted todo id=${todo.id}`)),
      catchError(this.handleError<TodoEntry>('deleteTodo'))
    );
  }

   /** PUT: update the hero on the server */
   updateTodo(todo: TodoEntry): Observable<any> {
    return this.http.patch(`${this.endpoint}/${todo.id}`, todo, { headers: this.headers } ).pipe(
      tap(_ => this.log(`updated todo id=${todo.id}`)),
      catchError(this.handleError<any>('updateTodo'))
    );
   }
  
    /* GET todos whose name contains search term */
    searchTodos(term: string): Observable<TodoEntry[]> {
      if (!term.trim()) {
        // if not search term, return empty hero array.
        return of([]);
      }
      return this.http.get<TodoEntry[]>(`${this.endpoint}/?title=${term}`).pipe(
        tap(x => x.length ?
           this.log(`found todos matching "${term}"`) :
           this.log(`no todos matching "${term}"`)),
        catchError(this.handleError<TodoEntry[]>('searchTodo', []))
      );
      /*
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
           this.log(`found heroes matching "${term}"`) :
           this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
      */
    }


  getToken() {
    return localStorage.getItem('access_token');
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
     private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {
  
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

       // console.log('operation', operation)
  
        // TODO: better job of transforming error for user consumption
        this.log(`${operation}`);
  
        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }
  
    /** Log a HeroService message with the MessageService */
    private log(message: string) {
      this.messageService.add(`TodoService: ${message}`);
    }
}
