import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SeguridadFacade } from '../fachadas';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private seguridadFacade: SeguridadFacade
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      catchError((error: any) => {
        if ([401, 403].indexOf(error.status) !== -1) {
          if (this.seguridadFacade.tokenExpirado()) {
            this.seguridadFacade.cerrarSesion();
            //location.reload();
            this.router.navigateByUrl('/autenticacion');
          }
          return EMPTY;
        }
        return throwError(() => error);
      })
    );
  }
}
