import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { AppState } from 'src/app/app.state';
import { ServicioBaseService } from 'src/app/comun/servicios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipanteService extends ServicioBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'participantes';
  }

  obtenerPorToken(): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}`;
    return this.http.get(url, { headers: this.headers });
  }
}
