import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import { Paginado, RespuestaObjeto } from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import { Seguimiento } from '../modelos';
import { SeguimientoService } from '../servicios';
import { SeguimientoFilter } from '../modelos/filtros';
import {
  filtroSeguimientoSelector,
  paginadoSeguimientoSelector
} from '../estados/selectores';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoFacade {
  filtro: SeguimientoFilter = new SeguimientoFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<SeguimientoFilter> {
    return this.store.select(filtroSeguimientoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private seguimientoService: SeguimientoService
  ) {
    this.store.select(filtroSeguimientoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoSeguimientoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Seguimiento>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.seguimientoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Seguimiento>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerSeguimiento({
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
}
