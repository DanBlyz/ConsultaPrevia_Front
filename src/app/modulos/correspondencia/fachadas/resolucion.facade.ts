import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import {
  Codificador,
  Paginado,
  Respuesta,
  RespuestaLista,
  RespuestaObjeto
} from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import {
  filtroResolucionSelector,
  paginadoResolucionSelector
} from '../estados/selectores';
import { Resolucion } from '../modelos';
import { ResolucionFilter } from '../modelos/filtros';
import { ResolucionService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class ResolucionFacade {
  filtro: ResolucionFilter = new ResolucionFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<ResolucionFilter> {
    return this.store.select(filtroResolucionSelector);
  }

  constructor(
    private store: Store<AppState>,
    private resolucionService: ResolucionService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroResolucionSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoResolucionSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: ResolucionFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroResolucion({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: ResolucionFilter,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<Resolucion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.resolucionService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<Resolucion>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaResolucion({
              lista: [...respuesta.lista],
              paginado: { ...respuesta.paginado }
            })
          );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Resolucion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.resolucionService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Resolucion>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerResolucion({
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

  guardar(objeto: Resolucion): Promise<RespuestaObjeto<Resolucion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.resolucionService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Resolucion>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            if (this.paginado) {
              this.buscar(
                this.filtro,
                this.paginado.pagina,
                this.paginado.registrosPorPagina
              );
            }
          }
          this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  modificar(id: number, objeto: Resolucion): Promise<RespuestaObjeto<Resolucion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.resolucionService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Resolucion>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            if (this.paginado) {
              this.buscar(
                this.filtro,
                this.paginado.pagina,
                this.paginado.registrosPorPagina
              );
            }
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
      this.resolucionService.eliminar(id).subscribe((respuesta: Respuesta) => {
        if (respuesta.tipoRespuesta === 'Exito') {
          if (this.paginado) {
            this.buscar(
              this.filtro,
              this.paginado.pagina,
              this.paginado.registrosPorPagina
            );
          }
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
      this.resolucionService
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
