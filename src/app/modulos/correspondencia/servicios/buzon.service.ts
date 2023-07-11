import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { AppState } from 'src/app/app.state';
import { ServicioMetodosBaseService } from 'src/app/comun/servicios';

@Injectable({
  providedIn: 'root'
})
export class BuzonService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'buzones';
  }

  obtenerPorRefUniOrganizacionalId(
    refUniOrganizacionalId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/uni-organizacional/${refUniOrganizacionalId}`;
    return this.http.get(url, { headers: this.headers });
  }

  // BuzonUsuario
  obtenerBuzonUsuarioPorBuzonId(buzonId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${buzonId}/usuarios`;
    return this.http.get(url, { headers: this.headers });
  }

  obtenerBuzonUsuarioPorId(buzonId: number, id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${buzonId}/usuarios/${id}`;
    return this.http.get(url, { headers: this.headers });
  }

  guardarBuzonUsuario(buzonId: number, objeto: any): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${buzonId}/usuarios`;
    const body = JSON.stringify(objeto);
    return this.http.post(url, body, { headers: this.headers });
  }

  modificarBuzonUsuario(
    buzonId: number,
    id: number,
    objeto: any
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${buzonId}/usuarios/${id}`;
    const body = JSON.stringify(objeto);
    return this.http.patch(url, body, { headers: this.headers });
  }

  eliminarBuzonUsuario(buzonId: number, id: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/${buzonId}/usuarios/${id}`;
    return this.http.delete(url, { headers: this.headers });
  }

  obtenerBuzonUsuarioPorRefUniOrganizacionalId(
    refUniOrganizacionalId: number
  ): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/0/usuarios/uni-organizacional/${refUniOrganizacionalId}`;
    return this.http.get(url, { headers: this.headers });
  }

  obtenerCodificador(): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/codificador`;
    return this.http.get(url, { headers: this.headers });
  }
}
