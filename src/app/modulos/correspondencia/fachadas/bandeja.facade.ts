import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import { Paginado, RespuestaLista } from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import {
  filtroSeguimientoSelector,
  paginadoSeguimientoSelector
} from '../estados/selectores';
import { Seguimiento } from '../modelos';
import { SeguimientoFilter } from '../modelos/filtros';
import { BandejaService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class BandejaFacade {
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
    private bandejaService: BandejaService
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

  establecerFiltro(filtro: SeguimientoFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroSeguimiento({
        filtro: { ...filtro }
      })
    );
  }

  borrador(filtro: SeguimientoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.bandejaService
      .borrador(filtro, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaSeguimiento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  entrada(filtro: SeguimientoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.bandejaService
      .entrada(filtro, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaSeguimiento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  salida(filtro: SeguimientoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.bandejaService
      .salida(filtro, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaSeguimiento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  enviado(filtro: SeguimientoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.bandejaService
      .enviado(filtro, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaSeguimiento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  archivado(filtro: SeguimientoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.bandejaService
      .archivado(filtro, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Seguimiento>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaSeguimiento({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }
}
