import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Access } from '../model/access.model';
import { ApiResponse } from '../model/api-response.model';
import { IServices } from './interface/iservices';

@Injectable({
  providedIn: 'root'
})
export class UrlFileServiceService implements IServices {

  constructor(private http: HttpClient) { }

  getFileFromURL(url: string) {
    return this.http.get<any>(url,{ responseType: 'blob' as 'json'}).toPromise();
  }

  handleError<T>(operation: string, result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }
  log(message: string) {
    console.log(message);
  }
}
