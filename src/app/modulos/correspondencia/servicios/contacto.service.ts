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
export class ContactoService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'contactos';
  }

  obtenerCodificador(): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/codificador`;
    return this.http.get(url, { headers: this.headers });
  }
}
