import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as ComunAcciones from '../../comun/estados';

import { AppState } from 'src/app/app.state';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';

@Injectable({
  providedIn: 'root'
})
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<AppState>,
    private seguridadFacade: SeguridadFacade,
    private modalService: NgbModal
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      catchError((error: any) => {
        if ([401, 403].indexOf(error.status) !== -1) {
          this.modalService.dismissAll();
          if (this.seguridadFacade.tokenExpirado()) {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            this.store.dispatch(
              ComunAcciones.establecerNotificacion({
                respuesta: {
                  tipoRespuesta: 'Error',
                  titulo: 'Autenticación',
                  mensaje: 'Sesión caducada'
                }
              })
            );
          } else {
            this.store.dispatch(
              ComunAcciones.establecerProcesando({ procesando: false })
            );
            this.store.dispatch(
              ComunAcciones.establecerNotificacion({
                respuesta: {
                  tipoRespuesta: 'Error',
                  titulo: 'Autenticación',
                  mensaje: 'Acceso denegado'
                }
              })
            );
          }
          return throwError(() => error);
        } else {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.store.dispatch(
            ComunAcciones.establecerRespuesta({
              respuesta: {
                tipoRespuesta: 'Error',
                titulo: `${error.status} ${error.statusText}`,
                mensaje: error.message
              }
            })
          );
          return throwError(() => error);
        }
      })
    );
  }
}
