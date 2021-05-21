import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Content } from '@angular/compiler/src/render3/r3_ast';

export class UserAdd {
  id!: Number;
  Name!: String;
  Password!: String;
  Email!: String;
  Phone!: String;
  Gender!: Number;
  TitleName!: Number;
  Status!: Number;
}

export class LoginData {
  id!: Number;
  Email!: String;
  Password!: String;
}

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  // Node Express API
  REST_API: string = 'http://localhost:9000/api/';

  //Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) {}

  //Add
  Add_User(data: UserAdd): Observable<any> {
    let API_URL = `${this.REST_API}insert`;
    return this.httpClient
      .post<any>(API_URL, data)
      .pipe(catchError(this.handleError));
  }

  //Get Data
  GetGender(): Observable<any> {
    let API_URL = `${this.REST_API}gender`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  GetTitleName(): Observable<any> {
    let API_URL = `${this.REST_API}titlename`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  GetStatus(): Observable<any> {
    let API_URL = `${this.REST_API}status`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  LoginPost(data: LoginData): Observable<any> {
    let API_URL = `${this.REST_API}login`;
    return this.httpClient.post(API_URL, data).pipe(
      map((res) => {
        return res;
      })
    );
  }

  //Handle Error
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
