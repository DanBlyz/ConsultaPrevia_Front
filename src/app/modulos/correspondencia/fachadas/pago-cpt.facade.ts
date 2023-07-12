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
  filtroPagoCptSelector,
  paginadoPagoCptSelector
} from '../estados/selectores';
import { PagoCpt } from '../modelos';
import { PagoCptFilter } from '../modelos/filtros';
import { PagoCptService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class PagoCptFacade {
  filtro: PagoCptFilter = new PagoCptFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<PagoCptFilter> {
    return this.store.select(filtroPagoCptSelector);
  }

  constructor(
    private store: Store<AppState>,
    private pagoCptService: PagoCptService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroPagoCptSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoPagoCptSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: PagoCptFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroPagoCpt({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: PagoCptFilter,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<PagoCpt>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.pagoCptService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<PagoCpt>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaPagoCpt({
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

  obtenerPorId(id: number): Promise<RespuestaObjeto<PagoCpt>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.pagoCptService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<PagoCpt>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerPagoCpt({
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

  guardar(objeto: PagoCpt): Promise<RespuestaObjeto<PagoCpt>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.pagoCptService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<PagoCpt>) => {
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

  modificar(id: number, objeto: PagoCpt): Promise<RespuestaObjeto<PagoCpt>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.pagoCptService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<PagoCpt>) => {
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
      this.pagoCptService.eliminar(id).subscribe((respuesta: Respuesta) => {
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
      this.pagoCptService
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
