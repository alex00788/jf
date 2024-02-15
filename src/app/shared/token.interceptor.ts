import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {ApiService} from "./services/api.service";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
// const token: any = localStorage.getItem('accessToken')
  const apiService = inject(ApiService)                                           //сервис инжектим так
  if (apiService.token) {                                                     // если токен есть то добавляем хедер
    const authReq = req.clone({
      headers: req.headers.set('authorizationToken', apiService.token)
    })
    return next(authReq);
  } else {
    return next(req);
  }

};
