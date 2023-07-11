import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RespuestaObjeto } from '../../../comun/modelos/respuesta-objeto.model';
import { RespuestaLista } from '../../../comun/modelos/respuesta-lista.model';
import { Respuesta } from '../../../comun/modelos/respuesta.model';
import { Paginado } from 'src/app/comun/modelos/paginado.model';

import { AppState } from '../../../app.state';
import { ComunState } from '../../../comun/estados/comun.state';
import { CorrespondenciaState } from '../estados/correspondencia.state';

import {
  filtroPlantillaSelector,
  paginadoPlantillaSelector
} from '../estados/selectores/plantilla.selector';

import * as ComunAcciones from '../../../comun/estados/comun.actions';
import * as CorrespondenciaAcciones from '../estados/acciones';

import { Plantilla } from '../modelos/plantilla.model';
import { PlantillaFilter } from '../modelos/filtros/plantilla.filter';
import { PlantillaService } from '../servicios/plantilla.service';

@Injectable({
  providedIn: 'root'
})
export class PlantillaFacade {
  filtro: PlantillaFilter = new PlantillaFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<PlantillaFilter> {
    return this.store.select(filtroPlantillaSelector);
  }

  constructor(
    private store: Store<AppState>,
    private plantillaService: PlantillaService
  ) {
    this.store.select(filtroPlantillaSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoPlantillaSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: PlantillaFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroPlantilla({
        filtro: { ...filtro }
      })
    );
  }

  buscar(objeto: PlantillaFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.plantillaService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Plantilla>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaPlantilla({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Plantilla>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.plantillaService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Plantilla>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerPlantilla({
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

  guardar(objeto: Plantilla): Promise<RespuestaObjeto<Plantilla>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.plantillaService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Plantilla>) => {
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
    objeto: Plantilla
  ): Promise<RespuestaObjeto<Plantilla>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.plantillaService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Plantilla>) => {
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
      this.plantillaService.eliminar(id).subscribe((respuesta: Respuesta) => {
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

  obtenerPorTipoDocumentoId(
    tipoDocumentoId: number
  ): Promise<RespuestaObjeto<Plantilla>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.plantillaService
        .obtenerPorTipoDocumentoId(tipoDocumentoId)
        .subscribe((respuesta: RespuestaObjeto<Plantilla>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerPlantilla({
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
