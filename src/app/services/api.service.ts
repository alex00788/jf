import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({providedIn: "root",})

export class ApiService {

  constructor(
    private http: HttpClient
  ) {
  }

  registration() {

  }

  login(user: any): Observable<any> {
    console.log('20', user)
    return this.http.post('/api/user/login', user)
  }

}
