import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ServicioBaseService } from 'src/app/comun/servicios';
import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { AppState } from 'src/app/app.state';

@Injectable({
  providedIn: 'root'
})
export class HojaRutaService extends ServicioBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'hojas-ruta';
  }

  buscar(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/buscar`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  obtenerPorId(id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${id}`;
    return this.http.get(url, { headers: this.headers });
  }

  obtenerPorNumero(numero: string): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/numero/${numero}`;
    return this.http.get(url, { headers: this.headers });
  }
}
