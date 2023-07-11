import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import {
  Paginado,
  RespuestaLista,
  RespuestaObjeto
} from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import * as CorrespondenciaAcciones from '../estados/acciones';
import {
  filtroHojaRutaSelector,
  paginadoTipoDocumentoSelector
} from '../estados/selectores';
import { HojaRuta } from '../modelos';
import { HojaRutaFilter } from '../modelos/filtros';
import { HojaRutaService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class HojaRutaFacade {
  filtro: HojaRutaFilter = new HojaRutaFilter();
  paginado: Paginado;

  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  get Filtro$(): Observable<HojaRutaFilter> {
    return this.store.select(filtroHojaRutaSelector);
  }

  constructor(
    private store: Store<AppState>,
    private hojaRutaService: HojaRutaService
  ) {
    this.store.select(filtroHojaRutaSelector).subscribe((filtro) => {
      if (filtro != null) {
        this.filtro = filtro;
      }
    });
    this.store.select(paginadoTipoDocumentoSelector).subscribe((paginado) => {
      if (paginado != null) {
        this.paginado = paginado;
      }
    });
  }

  establecerFiltro(filtro: HojaRutaFilter): void {
    this.store.dispatch(
      CorrespondenciaAcciones.establecerFiltroHojaRuta({
        filtro: { ...filtro }
      })
    );
  }

  buscar(objeto: HojaRutaFilter, pagina: number, cantidad: number): void {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    this.hojaRutaService
      .buscar(objeto, pagina, cantidad)
      .subscribe((respuesta: RespuestaLista<HojaRuta>) => {
        this.store.dispatch(
          CorrespondenciaAcciones.establecerListaHojaRuta({
            lista: [...respuesta.lista],
            paginado: { ...respuesta.paginado }
          })
        );
        this.store.dispatch(
          ComunAcciones.establecerProcesando({ procesando: false })
        );
      });
  }

  obtenerPorId(id: number): Promise<RespuestaObjeto<HojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.hojaRutaService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<HojaRuta>) => {
          this.store.dispatch(
            CorrespondenciaAcciones.establecerHojaRuta({
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

  // guardar(objeto: HojaRuta): Promise<RespuestaObjeto<HojaRuta>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.hojaRutaService
  //       .guardar(objeto)
  //       .subscribe((respuesta: RespuestaObjeto<HojaRuta>) => {
  //         if (respuesta.tipoRespuesta === 'Exito') {
  //           if (this.paginado) {
  //             this.buscar(
  //               this.filtro,
  //               this.paginado.pagina,
  //               this.paginado.registrosPorPagina
  //             );
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

  // modificar(id: number, objeto: HojaRuta): Promise<RespuestaObjeto<HojaRuta>> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.hojaRutaService
  //       .modificar(id, objeto)
  //       .subscribe((respuesta: RespuestaObjeto<HojaRuta>) => {
  //         if (respuesta.tipoRespuesta === 'Exito') {
  //           if (this.paginado) {
  //             this.buscar(
  //               this.filtro,
  //               this.paginado.pagina,
  //               this.paginado.registrosPorPagina
  //             );
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

  // eliminar(id: number): Promise<Respuesta> {
  //   this.store.dispatch(
  //     ComunAcciones.establecerProcesando({ procesando: true })
  //   );
  //   return new Promise((resolve) => {
  //     this.hojaRutaService.eliminar(id).subscribe((respuesta: Respuesta) => {
  //       if (respuesta.tipoRespuesta === 'Exito') {
  //         if (this.paginado) {
  //           this.buscar(
  //             this.filtro,
  //             this.paginado.pagina,
  //             this.paginado.registrosPorPagina
  //           );
  //         }
  //       }
  //       this.store.dispatch(ComunAcciones.establecerRespuesta({ respuesta }));
  //       this.store.dispatch(
  //         ComunAcciones.establecerProcesando({ procesando: false })
  //       );
  //       resolve(respuesta);
  //     });
  //   });
  // }

  obtenerPorNumero(numero: string): Promise<RespuestaObjeto<HojaRuta>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.hojaRutaService
        .obtenerPorNumero(numero)
        .subscribe((respuesta: RespuestaObjeto<HojaRuta>) => {
          // this.store.dispatch(
          //   CorrespondenciaAcciones.establecerHojaRuta({
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
