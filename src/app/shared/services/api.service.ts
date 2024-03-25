import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {ErrorResponseService} from "./error.response.service";
import {DateService} from "../../components/personal-page/calendar-components/date.service";

@Injectable({providedIn: "root",})

export class ApiService {

  // token:UserData;
  constructor(
    private http: HttpClient,
    private date: DateService,
    private errorResponseService: ErrorResponseService
  ) {}

  //перехват и показ ошибки
  public errHandler(err: HttpErrorResponse) {
    if (!err.error?.message) {
      this.errorResponseService.localHandler('ошибка при запросе на серв')
      return throwError(() => err)
    } else {
      this.errorResponseService.handler(err.error?.message)
      return throwError(() => err.error?.message)
    }
  }

  //хранение токена в локал стораж
  //достаем токен из ответа сервера и сохраняем в локалстораж + время жизни токена
  private setToken(response: any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000).getTime()
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('tokenExp', expDate.toString())
      localStorage.setItem('userData', JSON.stringify(response.user))
    } else {
      localStorage.clear();
    }
  }

  // проверка что время жизни токена не истекло
  get token(): any {
    const expDate = localStorage.getItem('tokenExp')
    if (expDate) {
      if (new Date().getTime() > +expDate) {
        this.logout();                                          //если время истекло, выходим из системы, чистим localStorage
        return null;
      }
    }
    return localStorage.getItem('accessToken');           // если все ок, возвращаем токен
  }

  registration(user: any): Observable<any> {
    return this.http.post<any>('/api/user/registration', user)
      .pipe(
        tap(this.setToken),                                              // устанавливает токен в localStorage
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

  getAllEntry(date: any): Observable<any> {
    return this.http.get<any>('/api/user/getAllEntry', {
      params: new HttpParams().append('date', date)
    })
      .pipe(catchError(this.errHandler.bind(this)))
  }

  getAllOrgFromDb(): Observable<any> {
    return this.http.get<any>('/api/user/getAllOrg')
      .pipe(catchError(this.errHandler.bind(this)))
  }


  getAllEntryInCurrentTimes(dateAndTimeRec: any): Observable<any> {
    return this.http.get<any>('/api/user/getAllEntryInCurrentTimes', {
      params: new HttpParams().append('dateRec', dateAndTimeRec.dateRec).append('timeRec', dateAndTimeRec.timeRec)
    })
      .pipe(catchError(this.errHandler.bind(this)))
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>('/api/user/getAllUsers')
      .pipe(catchError(this.errHandler.bind(this)))
  }

  getAllUsersCurrentOrganization (organization: any): Observable<any> {
    return this.http.get<any>('/api/user/getAllUsersCurrentOrganization', {
      params: new HttpParams().append('organization', organization)
    })
      .pipe(catchError(this.errHandler.bind(this)))
  }

  addEntry(newUserAccount: any): Observable<any> {
    return this.http.post<any>('/api/user/addEntry', newUserAccount)
    .pipe(catchError(this.errHandler.bind(this)))
  }

  addNewOrganization(newOrgData: any): Observable<any> {
    return this.http.post<any>('/api/user/addOrg', newOrgData)
      .pipe(catchError(this.errHandler.bind(this)))
  }


  deleteEntry(id: any, userId: any): Observable<any> {
    return this.http.delete<any>('/api/user/deleteEntry/' + id + '/' + userId)
      .pipe(catchError(this.errHandler.bind(this)))
  }


  changeRoleSelectedUser(userId: any) : Observable<any> {
    return this.http.put<any>('/api/user/changeRole/' + userId, userId)
      .pipe(catchError(this.errHandler.bind(this)))
  }
}
