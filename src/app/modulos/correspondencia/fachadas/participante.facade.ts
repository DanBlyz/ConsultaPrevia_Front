import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import { RespuestaObjeto } from '../../../comun/modelos';
import * as ComunAcciones from '../../../comun/estados';

import * as CorrespondenciaAcciones from '../estados/acciones';
import { Participante } from '../modelos';
import { ParticipanteService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteFacade {
  constructor(
    private store: Store<AppState>,
    private contactoService: ParticipanteService
  ) {}

  obtenerPorToken(): Promise<RespuestaObjeto<Participante>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.contactoService
        .obtenerPorToken()
        .subscribe((respuesta: RespuestaObjeto<Participante>) => {
          // this.store.dispatch(
          //   CorrespondenciaAcciones.establecerParticipante({
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
