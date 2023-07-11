import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import { RespuestaObjeto } from '../../../comun/modelos';
import * as ComunAcciones from '../../../comun/estados';

import * as CorrespondenciaAcciones from '../estados/acciones';
import { BuzonUsuario } from '../modelos';
import { BuzonUsuarioService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class BuzonUsuarioFacade {
  constructor(
    private store: Store<AppState>,
    private contactoService: BuzonUsuarioService
  ) {}

  obtenerPorToken(): Promise<RespuestaObjeto<BuzonUsuario>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.contactoService
        .obtenerPorToken()
        .subscribe((respuesta: RespuestaObjeto<BuzonUsuario>) => {
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
