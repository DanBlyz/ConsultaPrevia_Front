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
  filtroReunionSelector,
  paginadoReunionSelector
} from '../estados/selectores';
import { Reunion } from '../modelos';
import { ReunionFilter } from '../modelos/filtros';
import { ReunionService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class ReunionFacade {
  filtro: ReunionFilter = new ReunionFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<ReunionFilter> {
    return this.store.select(filtroReunionSelector);
  }

  constructor(
    private store: Store<AppState>,
    private reunionService: ReunionService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroReunionSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoReunionSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: ReunionFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroReunion({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: ReunionFilter,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<Reunion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.reunionService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<Reunion>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaReunion({
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

  obtenerPorId(id: number): Promise<RespuestaObjeto<Reunion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.reunionService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Reunion>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerReunion({
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

  guardar(objeto: Reunion): Promise<RespuestaObjeto<Reunion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.reunionService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Reunion>) => {
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

  modificar(id: number, objeto: Reunion): Promise<RespuestaObjeto<Reunion>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.reunionService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Reunion>) => {
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
      this.reunionService.eliminar(id).subscribe((respuesta: Respuesta) => {
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
      this.reunionService
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
