import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AppState } from 'src/app/app.state';
// import { environment } from 'src/environments/environment';
import { ServicioMetodosBaseService } from 'src/app/comun/servicios';
import { EnvironmentHelper } from 'src/app/comun/auxiliares';

@Injectable({
  providedIn: 'root'
})
export class ParametroService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');
  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'parametros';
  }
}
