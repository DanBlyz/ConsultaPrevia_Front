import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';

import { ServicioMetodosBaseService } from 'src/app/comun/servicios/servicio-metodos-base.service';

@Injectable({
  providedIn: 'root'
})
export class PlantillaService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'plantillas';
  }

  obtenerPorTipoDocumentoId(tipoDocumentoId: number): Observable<any> {
    const url = `${this.urlApiBase}/${this.controlador}/tipo-documento/${tipoDocumentoId}`;
    return this.http.get(url, { headers: this.headers });
  }
}
