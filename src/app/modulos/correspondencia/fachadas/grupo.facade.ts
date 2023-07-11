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
  filtroGrupoSelector,
  paginadoGrupoSelector
} from '../estados/selectores';

import { Grupo, GrupoBuzon } from '../modelos';
import { GrupoFilter } from '../modelos/filtros';
import { GrupoService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class GrupoFacade {
  filtro: GrupoFilter = new GrupoFilter();
  paginado: Paginado;

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
    private grupoService: GrupoService
  ) {
    this.store.select(filtroGrupoSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoGrupoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: GrupoFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroGrupo({
        filtro: { ...filtro }
      })
    );
  }

  buscar(objeto: GrupoFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.grupoService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<Grupo>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaGrupo({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<Grupo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.grupoService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<Grupo>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerGrupo({
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

  guardar(objeto: Grupo): Promise<RespuestaObjeto<Grupo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.grupoService
        .guardar(objeto)
        .subscribe((respuesta: RespuestaObjeto<Grupo>) => {
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

  modificar(id: number, objeto: Grupo): Promise<RespuestaObjeto<Grupo>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.grupoService
        .modificar(id, objeto)
        .subscribe((respuesta: RespuestaObjeto<Grupo>) => {
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
      this.grupoService.eliminar(id).subscribe((respuesta: Respuesta) => {
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

  /*obtenerPorRefUniOrganizacionalId(
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
  }*/

  // BuzonUsuario
  // obtenerGrupoBuzonPorBuzonId(
  //   grupoId: number
  // ): Promise<RespuestaLista<GrupoBuzon>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.grupoService
  //       .obtenerGrupoBuzonPorGrupoId(grupoId)
  //       .subscribe((respuesta: RespuestaLista<GrupoBuzon>) => {
  //         this.store.dispatch(
  //           CorrespondenciaAcciones.establecerListaGrupoBuzon({
  //             lista: [...respuesta.lista],
  //             paginado: { ...respuesta.paginado }
  //           })
  //         );
  //         this.store.dispatch(
  //           ComunAcciones.establecerProcesando({ procesando: false })
  //         );
  //         resolve(respuesta);
  //       });
  //   });
  // }

  // obtenerGrupoBuzonPorId(
  //   grupoId: number,
  //   id: number
  // ): Promise<RespuestaObjeto<GrupoBuzon>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.grupoService
  //       .obtenerGrupoBuzonPorId(grupoId, id)
  //       .subscribe((respuesta: RespuestaObjeto<GrupoBuzon>) => {
  //         this.store.dispatch(
  //           CorrespondenciaAcciones.establecerGrupoBuzon({
  //             objeto: { ...respuesta.objeto }
  //           })
  //         );
  //         this.store.dispatch(
  //           ComunAcciones.establecerProcesando({ procesando: false })
  //         );
  //         resolve(respuesta);
  //       });
  //   });
  // }

  // guardarGrupoBuzon(
  //   grupoId: number,
  //   objeto: GrupoBuzon
  // ): Promise<RespuestaObjeto<GrupoBuzon>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.grupoService
  //       .guardarGrupoBuzon(grupoId, objeto)
  //       .subscribe((respuesta: RespuestaObjeto<GrupoBuzon>) => {
  //         if (respuesta.tipoRespuesta === 'Exito') {
  //           if (this.paginado) {
  //             //this.obtenerGrupoBuzonPorBuzonId(grupoId);
  //             this.obtenerGrupoBuzonPorBuzonId(grupoId);
  //           }
  //         }
  //         this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
  //         this.store.dispatch(
  //           ComunAcciones.establecerProcesando({ procesando: false })
  //         );
  //         resolve(respuesta);
  //       });
  //   });
  // }

  // modificarGrupoBuzon(
  //   grupoId: number,
  //   id: number,
  //   objeto: GrupoBuzon
  // ): Promise<RespuestaObjeto<GrupoBuzon>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.grupoService
  //       .modificarGrupoBuzon(grupoId, id, objeto)
  //       .subscribe((respuesta: RespuestaObjeto<GrupoBuzon>) => {
  //         if (respuesta.tipoRespuesta === 'Exito') {
  //           this.obtenerGrupoBuzonPorBuzonId(grupoId);
  //           if (this.paginado) {
  //             this.obtenerGrupoBuzonPorBuzonId(grupoId);
  //           }
  //         }
  //         this.store.dispatch(
  //           ComunAcciones.establecerProcesando({ procesando: false })
  //         );
  //         this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
  //         resolve(respuesta);
  //       });
  //   });
  // }

  // eliminarGrupoBuzon(grupoId: number, id: number): Promise<Respuesta> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.grupoService
  //       .eliminarGrupoBuzon(grupoId, id)
  //       .subscribe((respuesta: Respuesta) => {
  //         if (respuesta.tipoRespuesta === 'Exito') {
  //           if (this.paginado) {
  //             this.obtenerGrupoBuzonPorBuzonId(grupoId);
  //           }
  //         }
  //         this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
  //         this.store.dispatch(
  //           ComunAcciones.establecerProcesando({ procesando: false })
  //         );
  //         resolve(respuesta);
  //       });
  //   });
  // }

  /*obtenerBuzonUsuarioPorRefUniOrganizacionalId(
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
  }*/

  obtenerCodificador(): Promise<RespuestaLista<Codificador>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.grupoService
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
