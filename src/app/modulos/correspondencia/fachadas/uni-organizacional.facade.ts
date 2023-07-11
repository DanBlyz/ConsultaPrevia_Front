import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../../../app.state';
import {
  Codificador,
  RespuestaLista,
  RespuestaObjeto
} from '../../../comun/modelos';
import { ComunState } from '../../../comun/estados';
import * as ComunAcciones from '../../../comun/estados';

import { CorrespondenciaState } from '../estados';
import { Persona, Puesto, UniOrganizacional } from '../modelos';
import { UniOrganizacionalService } from '../servicios';

@Injectable({
  providedIn: 'root'
})
export class UniOrganizacionalFacade {
  get ComunState$(): Observable<ComunState> {
    return this.store.select('comun');
  }

  get CorrespondenciaState$(): Observable<CorrespondenciaState> {
    return this.store.select('correspondencia');
  }

  constructor(
    private store: Store<AppState>,
    private uniOrganizacionalService: UniOrganizacionalService
  ) {}

  obtenerPorId(id: number): Promise<RespuestaObjeto<UniOrganizacional>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.uniOrganizacionalService
        .obtenerPorId(id)
        .subscribe((respuesta: RespuestaObjeto<UniOrganizacional>) => {
          // this.store.dispatch(
          //   CorrespondenciaAcciones.establecerUniOrganizacional({
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

  obtenerCodificador(): Promise<RespuestaLista<Codificador>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.uniOrganizacionalService
        .obtenerCodificador()
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // Puesto
  obtenerPuestosCodificador(
    uniOrganizacionalId: number
  ): Promise<RespuestaLista<Codificador>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.uniOrganizacionalService
        .obtenerPuestosCodificador(uniOrganizacionalId)
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  obtenerPuestosPorUniOrganizacionalId(
    uniOrganizacionalId: number,
    puestoId: number
  ): Promise<RespuestaObjeto<Puesto>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.uniOrganizacionalService
        .obtenerPuestosPorUniOrganizacionalId(uniOrganizacionalId, puestoId)
        .subscribe((respuesta: RespuestaLista<Codificador>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }

  // Persona
  obtenerPersonas(
    uniOrganizacionalId: number
  ): Promise<RespuestaLista<Persona>> {
    this.store.dispatch(
      ComunAcciones.establecerProcesando({ procesando: true })
    );
    return new Promise((resolve) => {
      this.uniOrganizacionalService
        .obtenerPersonas(uniOrganizacionalId)
        .subscribe((respuesta: RespuestaLista<Persona>) => {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          resolve(respuesta);
        });
    });
  }
}
