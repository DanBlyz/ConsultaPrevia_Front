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
  filtroActoAdministrativoSelector,
  paginadoActoAdministrativoSelector
} from '../estados/selectores';
import { ActoAdministrativo } from '../modelos';
import { ActoAdministrativoFilter } from '../modelos/filtros';
import { ActoAdministrativoService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class ActoAdministrativoFacade {
  filtro: ActoAdministrativoFilter = new ActoAdministrativoFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<ActoAdministrativoFilter> {
    return this.store.select(filtroActoAdministrativoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private actoAdministrativoService: ActoAdministrativoService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroActoAdministrativoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoActoAdministrativoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: ActoAdministrativoFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroActoAdministrativo({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: ActoAdministrativoFilter,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<ActoAdministrativo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.actoAdministrativoService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<ActoAdministrativo>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaActoAdministrativo({
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

  obtenerPorId(id: number): Promise<RespuestaObjeto<ActoAdministrativo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.actoAdministrativoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<ActoAdministrativo>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerActoAdministrativo({
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

  guardar(objeto: ActoAdministrativo): Promise<RespuestaObjeto<ActoAdministrativo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.actoAdministrativoService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<ActoAdministrativo>) => {
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

  modificar(id: number, objeto: any): Promise<RespuestaObjeto<ActoAdministrativo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.actoAdministrativoService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<ActoAdministrativo>) => {
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
      this.actoAdministrativoService.eliminar(id).subscribe((respuesta: Respuesta) => {
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
      this.actoAdministrativoService
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
