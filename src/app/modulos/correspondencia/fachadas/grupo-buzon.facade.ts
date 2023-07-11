import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import { RespuestaLista, RespuestaObjeto } from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import {
  filtroGrupoSelector,
  paginadoGrupoSelector
} from '../estados/selectores';

import { GrupoBuzon } from '../modelos';
import { GrupoBuzonService } from '../servicios';
import { GrupoFilter } from '../modelos/filtros';

@Injectable({
  providedIn: 'root'
})
export class GrupoBuzonFacade {
  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<GrupoFilter> {
    return this.store.select(filtroGrupoSelector);
  }

  constructor(
    private store: Store<AppState>,
    private grupoBuzonService: GrupoBuzonService
  ) {}

  obtenerPorToken(): Promise<RespuestaObjeto<GrupoBuzon>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.grupoBuzonService
        .obtenerPorToken()
        .subscribe((respuesta: RespuestaObjeto<GrupoBuzon>) => {
          // this.store.dispatch(
          //   CorrespondenciaAcciones.establecerBuzonUsuario({
          //     objeto: { ...respuesta.objeto }
          //   })
          // );
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }
}
