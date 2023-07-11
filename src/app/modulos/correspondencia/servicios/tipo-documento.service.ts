import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';
import { ServicioMetodosBaseService } from 'src/app/comun/servicios';

import { AppState } from 'src/app/app.state';
import { TipoDocumentoFilter } from '../modelos/filtros';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'tipos-documento';
  }

  obtenerCodificador(): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/codificador`;
    return this.http.get(url, { headers: this.headers });
  }

  obtenerCodificadorFiltrado(filtro: TipoDocumentoFilter): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/codificador`;
    const body = JSON.stringify(filtro);
    return this.http.post(url, body, { headers: this.headers });
  }
}
