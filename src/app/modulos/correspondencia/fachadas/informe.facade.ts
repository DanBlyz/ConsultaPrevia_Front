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
  filtroInformeSelector,
  paginadoInformeSelector
} from '../estados/selectores';
import { Informe } from '../modelos';
import { InformeFilter } from '../modelos/filtros';
import { InformeService } from '../servicios';

import { ClasificacionService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class InformeFacade {
  filtro: InformeFilter = new InformeFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<InformeFilter> {
    return this.store.select(filtroInformeSelector);
  }

  constructor(
    private store: Store<AppState>,
    private informeService: InformeService,
    private clasificacionService: ClasificacionService
  ) {
    this.store.select(filtroInformeSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoInformeSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: InformeFilter | any): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroInforme({
        filtro: { ...filtro }
      })
    );
  }

  buscar(
    objeto: InformeFilter | any,
    pagina: number,
    cantidad: number
  ): Promise<RespuestaLista<Informe>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.informeService
        .buscar(objeto, pagina, cantidad)
        .subscribe((respuesta: RespuestaLista<Informe>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaInforme({
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

  obtenerPorId(id: number): Promise<RespuestaObjeto<Informe>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.informeService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Informe>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerInforme({
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

  guardar(objeto: Informe): Promise<RespuestaObjeto<Informe>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.informeService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Informe>) => {
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

  modificar(id: number, objeto: Informe): Promise<RespuestaObjeto<Informe>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.informeService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Informe>) => {
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
      this.informeService.eliminar(id).subscribe((respuesta: Respuesta) => {
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
      this.informeService
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
