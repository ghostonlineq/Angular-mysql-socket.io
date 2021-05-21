import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { getTokenSourceMapRange } from 'typescript';

// const httpOption = {
//   headers: new HttpHeaders({ 'Content-Type': 'application/json'})
// };

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  REST_API: string = 'http://localhost:9000/api/';
  httpOption: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {
    this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearStorage() {
    localStorage.clear();
  }

  Login(Email: string, Password: string): Observable<any> {
    let API_URL = `${this.REST_API}login`;
    return this.httpClient
      .post<any>(API_URL, { Email, Password }, this.httpOption)
      .pipe(
        map((res: any) => {
          localStorage.setItem('token', res.token);
          // console.log(res);
          return res || {};
        }),
        catchError(this.handleError)
      );
  }
  isLogin(): Observable<any> {
    var tokenKey = this.getToken();
    var header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenKey}`,
      }),
    };
    let API_URL = `${this.REST_API}login/profile`;
    return this.httpClient.get(API_URL, header).pipe(
      map((res: any) => {
        console.log(res);
        return res || {};
      }),
      catchError(this.handleError)
    );
  }
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
      console.log(errorMessage);
    }
    // Handle server error
    else {
      errorMessage = `Error Code ${error.status}\n Message: ${error.message}`;
      console.log(errorMessage);
    }
    return throwError(errorMessage);
  }
}
