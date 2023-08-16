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
  filtroDocumentoSelector,
  paginadoDocumentoSelector
} from '../estados/selectores';
import { Documento } from '../modelos';
import { DocumentoFilter } from '../modelos/filtros';
import { DocumentoService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class DocumentoFacade {
  filtro: DocumentoFilter = new DocumentoFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<DocumentoFilter> {
    return this.store.select(filtroDocumentoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private documentoService: DocumentoService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroDocumentoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoDocumentoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: DocumentoFilter | any): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroDocumento({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: DocumentoFilter | any,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<Documento>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaDocumento({
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

  obtenerPorId(id: number): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerDocumento({
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

  guardar(objeto: Documento): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
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

  modificar(id: number, objeto: any): Promise<RespuestaObjeto<Documento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Documento>) => {
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
      this.documentoService.eliminar(id).subscribe((respuesta: Respuesta) => {
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
      this.documentoService
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
