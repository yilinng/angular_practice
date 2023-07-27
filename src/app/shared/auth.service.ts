import { Injectable } from '@angular/core';
import { UserEntry, Email, UserInformation } from '../types/types';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from './../message.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint: string = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', "Bearer " + this.getToken())
  currentUser = {};
  constructor(private http: HttpClient, public router: Router, private messageService: MessageService) { }
  // Sign-up
  signUp(user: UserEntry): Observable<any> {
    let api = `${this.endpoint}/signup`;
    return this.http.post(api, user).pipe(
      tap((res: UserInformation) => this.log(`added user ${res}`)),
      catchError(this.handleError<UserEntry>('signup')));
  }
  // Sign-in
  logIn(user: UserEntry) {
    let api = `${this.endpoint}/login`;
    return this.http
      .post<any>(api, user).pipe(
        tap((res: any) => {
          localStorage.setItem('access_token', res.addTokenEntry.accessToken);
          localStorage.setItem('user_id', res.user.id);
          this.log(`login user ${res}`)
        }),
        catchError(this.handleError<UserEntry>('login')));
  };

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    return this.getToken() !== null ? true : false;
  }

  doLogout() {
    return this.http.delete(`${this.endpoint}/users/logout`, { headers: this.headers }).pipe(
      tap((res: any) => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        this.currentUser = {}
        this.log(`logout user ${res}`)
      }),
      catchError(this.handleError<UserEntry>('logout')));
  }
  // User profile
  getUserProfile(id: any): Observable<any> {

    let pass_Id = id || localStorage.getItem('user_id');

    let api = `${this.endpoint}/users/${pass_Id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        console.log(' getUserProfile', res)
        this.currentUser = res;
        return res || {};
      }),
      catchError(this.handleError<UserEntry>('getUserProfile'))
    );
  }

  //get email
  getEmail() {
    const url = `${this.endpoint}/users/email`;
    const emails = this.http.get<Email>(url);
    this.log(`authService: fetched email`)
    return emails
  }
  // Error
  /*
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
  */
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

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a authService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`authService: ${message}`);
  }
}