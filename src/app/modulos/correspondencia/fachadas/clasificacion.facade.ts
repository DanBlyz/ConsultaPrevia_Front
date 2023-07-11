import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import {
  Codificador,
  Respuesta,
  RespuestaLista,
  RespuestaObjeto
} from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import { Clasificacion } from '../modelos';
import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionFacade {
  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  constructor(
    private store: Store<AppState>,
    private clasificacionService: ClasificacionService
  ) {}

  obtenerTodo(): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.clasificacionService
      .obtenerTodo()
      .subscribe((respuesta: RespuestaLista<Clasificacion>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaClasificacion({
            lista: [...respuesta.lista]
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  // buscar(objeto: Clasificacion, pagina: number, cantidad: number): void {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   this.clasificacionService
  //     .buscar(objeto, pagina, cantidad)
  //     .subscribe((respuesta: RespuestaLista<Clasificacion>) => {
  //       this.store.dispatch(
  //         CorrespondenciaAcciones.establecerListaClasificacion({
  //           lista: [...respuesta.lista]
  //         })
  //       );
  //       this.store.dispatch(
  //         ComunAcciones.establecerProcesando({ procesando: false })
  //       );
  //     });
  // }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Clasificacion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.clasificacionService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Clasificacion>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerClasificacion({
              objeto: { ...respuesta.objeto }
            })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  guardar(objeto: Clasificacion): Promise<RespuestaObjeto<Clasificacion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.clasificacionService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Clasificacion>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerTodo();
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  modificar(
    id: number,
    objeto: Clasificacion
  ): Promise<RespuestaObjeto<Clasificacion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.clasificacionService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Clasificacion>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerTodo();
          }
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          resolve(respuesta);
        });
    });
  }

  eliminar(id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.clasificacionService
        .eliminar(id)
        .subscribe((respuesta: Respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerTodo();
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  obtenerCodificador(): Promise<RespuestaLista<Codificador>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.clasificacionService
        .obtenerCodificador()
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }
}
