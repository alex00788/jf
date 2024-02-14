import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {ErrorResponseService} from "./error.response.service";

@Injectable({providedIn: "root",})

export class ApiService {

  // token:UserData;
  constructor(
    private http: HttpClient,
    private errorResponseService: ErrorResponseService
  ) {}

//перехват и показ ошибки
  public errHandler(err: HttpErrorResponse) {
    this.errorResponseService.handler(err.error.message)
    return throwError(() => err.error.message)
  }

  registration(user: any): Observable<any> {
    return this.http.post<any>('/api/user/registration', user)
      .pipe(
        catchError(this.errHandler.bind(this)),
      )
  }

  login(user: any): Observable<any> {
    return this.http.post<any>('/api/user/login', user)
      .pipe(
        catchError(this.errHandler.bind(this)),
      )
  }


  // setToken(token)  {
  //   console.log('31', token)
  //   this.token = {...token}
  // }

  // getToken(): UserData {
  //   return this.token
  // }

  isAuthorized() {
    // если есть токен то return true
    return false
  }
}
