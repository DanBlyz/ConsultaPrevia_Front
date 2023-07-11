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
  filtroTipoDocumentoSelector,
  paginadoTipoDocumentoSelector
} from '../estados/selectores';
import { TipoDocumento } from '../modelos';
import { TipoDocumentoFilter } from '../modelos/filtros';
import { TipoDocumentoService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoFacade {
  filtro: TipoDocumentoFilter = new TipoDocumentoFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<TipoDocumentoFilter> {
    return this.store.select(filtroTipoDocumentoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private tipoDocumentoService: TipoDocumentoService
  ) {
    this.store.select(filtroTipoDocumentoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoTipoDocumentoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: TipoDocumentoFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroTipoDocumento({
        filtro: { ...filtro }
      })
    );
  }

  buscar(objeto: TipoDocumentoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.tipoDocumentoService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<TipoDocumento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaTipoDocumento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<TipoDocumento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.tipoDocumentoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<TipoDocumento>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerTipoDocumento({
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

  guardar(objeto: TipoDocumento): Promise<RespuestaObjeto<TipoDocumento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.tipoDocumentoService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<TipoDocumento>) => {
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

  modificar(
    id: number,
    objeto: TipoDocumento
  ): Promise<RespuestaObjeto<TipoDocumento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.tipoDocumentoService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<TipoDocumento>) => {
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
      this.tipoDocumentoService
        .eliminar(id)
        .subscribe((respuesta: Respuesta) => {
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
      this.tipoDocumentoService
        .obtenerCodificador()
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  obtenerCodificadorFiltrado(
    filtro: TipoDocumentoFilter
  ): Promise<RespuestaLista<Codificador>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.tipoDocumentoService
        .obtenerCodificadorFiltrado(filtro)
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }
}
