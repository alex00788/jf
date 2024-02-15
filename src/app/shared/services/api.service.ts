import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
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

  //хранение токена в локал стораж
  //достаем токен из ответа сервера и сохраняем в локалстораж + время жизни токена
  private setToken(response: any)  {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000).getTime()
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('tokenExp', expDate.toString())
    } else {
      localStorage.clear();
    }

    // this.token = {...token}
  }

                                                // проверка что время жизни токена не истекло
  get token(): any {
    const expDate = localStorage.getItem('tokenExp')
    if (expDate) {
      if (new Date().getTime() > +expDate) {
        this.logout();                                          //если время истекло выходим из системы чистим стораж
        return  null;
      }
    }
    return localStorage.getItem('accessToken');           // если все ок  возвращаем токен
  }

  // getToken(): UserData {
  //   return this.token
  // }


  registration(user: any): Observable<any> {
    return this.http.post<any>('/api/user/registration', user)
      .pipe(
        tap(this.setToken),                                              // устанавливае токен в локал стораж
        catchError(this.errHandler.bind(this)),
      )
  }

  login(user: any): Observable<any> {
    return this.http.post<any>('/api/user/login', user)
      .pipe(
        tap(this.setToken),
        catchError(this.errHandler.bind(this)),
      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated() {
    // если есть токен то return true
    return !!this.token
  }
}
