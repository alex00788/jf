import {
  ActivatedRouteSnapshot,
  CanActivate, CanActivateChild,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";

@Injectable({providedIn: "root"})
//имплеминтируемся от
export class AuthGuard implements CanActivate , CanActivateChild {
  constructor(
    //инектим чтоб достать метод который принимает токен и возвращает флаг да или нет
    private auth: ApiService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
   //если авторизован то показываем   или редиректим  на страницу логина
    if (this.auth.isAuthorized()) {
      return of(true)
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          notIsAuthorized: true
        }
      })
      return of(false)
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>{
    return this.canActivate(route, state)
}

}
