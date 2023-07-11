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
  filtroDocumentoHojaRutaSelector,
  paginadoDocumentoHojaRutaSelector
} from '../estados/selectores';
import { DocumentoHojaRuta } from '../modelos';
import { DocumentoHojaRutaFilter } from '../modelos/filtros';
import { DocumentoHojaRutaService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class DocumentoHojaRutaFacade {
  filtro: DocumentoHojaRutaFilter = new DocumentoHojaRutaFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<DocumentoHojaRutaFilter> {
    return this.store.select(filtroDocumentoHojaRutaSelector);
  }

  constructor(
    private store: Store<AppState>,
    private documentoHojaRutaService: DocumentoHojaRutaService
  ) {
    this.store.select(filtroDocumentoHojaRutaSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store
      .select(paginadoDocumentoHojaRutaSelector)
      .subscribe((paginado) => {
        if (paginado != null) {
          this.paginado = paginado;
        }
      });
  }

  establecerFiltro(filtro: DocumentoHojaRutaFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroDocumentoHojaRuta({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: DocumentoHojaRutaFilter,
    pagina: number,
    cantidad: number
  ): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.documentoHojaRutaService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<DocumentoHojaRuta>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaDocumentoHojaRuta({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<DocumentoHojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoHojaRutaService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<DocumentoHojaRuta>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerDocumentoHojaRuta({
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

  guardar(
    objeto: DocumentoHojaRuta
  ): Promise<RespuestaObjeto<DocumentoHojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoHojaRutaService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<DocumentoHojaRuta>) => {
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
    objeto: DocumentoHojaRuta
  ): Promise<RespuestaObjeto<DocumentoHojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.documentoHojaRutaService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<DocumentoHojaRuta>) => {
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
      this.documentoHojaRutaService
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
}
