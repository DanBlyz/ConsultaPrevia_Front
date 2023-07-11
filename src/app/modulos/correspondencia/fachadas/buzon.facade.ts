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
  filtroBuzonSelector,
  paginadoBuzonSelector
} from '../estados/selectores';

import { Buzon, BuzonUsuario } from '../modelos';
import { BuzonFilter } from '../modelos/filtros';
import { BuzonService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class BuzonFacade {
  filtro: BuzonFilter = new BuzonFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<BuzonFilter> {
    return this.store.select(filtroBuzonSelector);
  }

  constructor(
    private store: Store<AppState>,
    private buzonService: BuzonService
  ) {
    this.store.select(filtroBuzonSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoBuzonSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: BuzonFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroBuzon({
        filtro: { ...filtro }
      })
    );
  }

  buscar(objeto: BuzonFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.buzonService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Buzon>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaBuzon({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Buzon>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Buzon>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerBuzon({
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

  guardar(objeto: Buzon): Promise<RespuestaObjeto<Buzon>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Buzon>) => {
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

  modificar(id: number, objeto: Buzon): Promise<RespuestaObjeto<Buzon>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Buzon>) => {
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
      this.buzonService.eliminar(id).subscribe((respuesta: Respuesta) => {
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

  obtenerPorRefUniOrganizacionalId(
    refUniOrganizacionalId: number
  ): Promise<RespuestaLista<Buzon>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .obtenerPorRefUniOrganizacionalId(refUniOrganizacionalId)
        .subscribe((respuesta: RespuestaLista<Buzon>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // BuzonUsuario
  obtenerBuzonUsuarioPorBuzonId(
    personaId: number
  ): Promise<RespuestaLista<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .obtenerBuzonUsuarioPorBuzonId(personaId)
        .subscribe((respuesta: RespuestaLista<BuzonUsuario>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerListaBuzonUsuario({
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

  obtenerBuzonUsuarioPorId(
    buzonId: number,
    id: number
  ): Promise<RespuestaObjeto<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .obtenerBuzonUsuarioPorId(buzonId, id)
        .subscribe((respuesta: RespuestaObjeto<BuzonUsuario>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerBuzonUsuario({
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

  guardarBuzonUsuario(
    buzonId: number,
    objeto: BuzonUsuario
  ): Promise<RespuestaObjeto<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .guardarBuzonUsuario(buzonId, objeto)
        .subscribe((respuesta: RespuestaObjeto<BuzonUsuario>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            if (this.paginado) {
              this.obtenerBuzonUsuarioPorBuzonId(buzonId);
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

  modificarBuzonUsuario(
    buzonId: number,
    id: number,
    objeto: BuzonUsuario
  ): Promise<RespuestaObjeto<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .modificarBuzonUsuario(buzonId, id, objeto)
        .subscribe((respuesta: RespuestaObjeto<BuzonUsuario>) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.obtenerBuzonUsuarioPorBuzonId(buzonId);
            if (this.paginado) {
              this.obtenerBuzonUsuarioPorBuzonId(buzonId);
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

  eliminarBuzonUsuario(buzonId: number, id: number): Promise<Respuesta> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .eliminarBuzonUsuario(buzonId, id)
        .subscribe((respuesta: Respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            if (this.paginado) {
              this.obtenerBuzonUsuarioPorBuzonId(buzonId);
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

  obtenerBuzonUsuarioPorRefUniOrganizacionalId(
    refUniOrganizacionalId: number
  ): Promise<RespuestaLista<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.buzonService
        .obtenerBuzonUsuarioPorRefUniOrganizacionalId(refUniOrganizacionalId)
        .subscribe((respuesta: RespuestaLista<BuzonUsuario>) => {
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
      this.buzonService
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
