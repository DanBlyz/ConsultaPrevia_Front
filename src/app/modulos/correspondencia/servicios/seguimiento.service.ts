import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';
import { ServicioBaseService } from 'src/app/comun/servicios';

import { AppState } from 'src/app/app.state';

@Injectable({
  providedIn: 'root'
})
export class SeguimientoService extends ServicioBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'seguimientos';
  }

  obtenerPorId(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}`;
    return this.http.get(url, { headers: this.headers });
  }
}
