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
export class UniOrganizacionalService extends ServicioBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'uni-organizacionales';
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

  obtenerCodificador(): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/codificador`;
    return this.http.get(url, { headers: this.headers });
  }

  // Puesto
  obtenerPuestosCodificador(uniOrganizacionalId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${uniOrganizacionalId}/puestos/codificador`;
    return this.http.get(url, { headers: this.headers });
  }

  obtenerPuestosPorUniOrganizacionalId(
    uniOrganizacionalId: number,
    puestoId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${uniOrganizacionalId}/puestos/${puestoId}`;
    return this.http.get(url, { headers: this.headers });
  }

  // Persona
  obtenerPersonas(uniOrganizacionalId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${uniOrganizacionalId}/personas`;
    return this.http.get(url, { headers: this.headers });
  }
}
