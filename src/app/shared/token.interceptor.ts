import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
const token: any = localStorage.getItem('accessToken')
  const authReq = req.clone({
  headers: req.headers.set('authorizationToken', token)
})
  return next(authReq);
};
