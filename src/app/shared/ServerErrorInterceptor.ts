import { Injectable } from '@angular/core';
import { 
  HttpEvent, HttpRequest, HttpHandler, 
  HttpInterceptor, HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from '../message.service';

@Injectable()
 //https://medium.com/angular-in-depth/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4 
//https://stackoverflow.com/questions/70633922/http-error-interceptor-not-working-catcherror-not-working-with-angular-13  
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private messageService: MessageService, public router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(
      tap({
        next: () => null,
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.messageService.add('token is expired, plase login again.');
            this.authService.doLogout();
            //this.router.navigate(['log-in']);
          }
        }
    }))

    /*
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // refresh token
          this.router.navigate(['log-in']);

        } else {
          throwError(() => new Error(error.message))
          //return throwError(error);
        }
      })
    );
    */
  }
}


