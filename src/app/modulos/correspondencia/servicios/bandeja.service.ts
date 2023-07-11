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
export class BandejaService extends ServicioBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'bandejas';
  }

  borrador(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/borrador`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  entrada(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/entrada`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  salida(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/salida`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  enviado(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/enviado`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }

  archivado(
    objeto: any,
    pagina: number,
    registrosPorPagina: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/archivado`;
    const body = JSON.stringify({
      ...objeto,
      paginado: { pagina, registrosPorPagina }
    });
    return this.http.post(url, body, { headers: this.headers });
  }
}
