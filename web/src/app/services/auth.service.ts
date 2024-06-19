import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { environment } from '../../environments/environment';

import { catchError, takeUntil, tap } from 'rxjs/operators';
import { IServices } from './interface/iservices';
import { AppConfigService } from './app-config.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../model/api-response.model';
import { Users } from '../model/users';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IServices {
  isLoggedIn = false;
  redirectUrl: string;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private appconfig: AppConfigService
  ) {}

  async ngOnDestroy() {
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  register(data: any): Observable<ApiResponse<Users>> {
    return this.http
      .post<any>(
        environment.apiBaseUrl + this.appconfig.config.apiEndPoints.auth.register,
        data
      )
      .pipe(
        tap((_) => (this.isLoggedIn = true)),
        catchError(this.handleError('login', []))
      );
  }

  redirectToPage(auth: boolean) {
    this.router.navigate([auth ? 'auth' : ''], { replaceUrl: true });
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(
        `${operation} failed: ${
          Array.isArray(error.error.message)
            ? error.error.message[0]
            : error.error.message
        }`
      );
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
