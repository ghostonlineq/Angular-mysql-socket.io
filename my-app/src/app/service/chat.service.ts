import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { catchError, subscribeOn, map } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthUserService } from './auth-user.service';
import { io } from 'socket.io-client';

export class GroupChat {
  id!: Number;
  name!: String;
  group_type!: Number;
  email!: Array<any>;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private url = 'http://localhost:9000/';
  private socket;
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  tokenData: any;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthUserService
  ) {
    this.socket = io(this.url);
  }

  SocketConnect() {
    return this.socket;
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  Add_GroupChat(dataGroup: GroupChat): Observable<any> {
    let API_URL = `${this.url}api/chat/groupChat`;
    return this.httpClient
      .post<any>(API_URL, dataGroup)
      .pipe(catchError(this.handleError));
  }

  Get_GroupType(): Observable<any> {
    let API_URL = `${this.url}api/chat/groupType`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  Get_Another_User(): Observable<any> {
    let API_URL = `${this.url}api/chat/AllUser`;
    return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
      map((res: any) => {
        return res || {};
      })
    );
  }

  SelectUser(email: []) {
    let API_URL = `${this.url}api/chat/chatCollect`;
    return this.httpClient
      .post(API_URL,email )
      .pipe(catchError(this.handleError))
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
