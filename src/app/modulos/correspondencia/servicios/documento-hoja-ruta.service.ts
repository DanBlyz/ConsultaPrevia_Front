import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EnvironmentHelper } from 'src/app/comun/auxiliares';
import { ServicioMetodosBaseService } from 'src/app/comun/servicios';

import { AppState } from 'src/app/app.state';
import { DocumentoHojaRutaFilter } from '../modelos/filtros';

@Injectable({
  providedIn: 'root'
})
export class DocumentoHojaRutaService extends ServicioMetodosBaseService {
  private env = EnvironmentHelper.obtenerConfiguracion('correspondencia');

  constructor(
    protected override http: HttpClient,
    protected override store: Store<AppState>
  ) {
    super(http, store);
    this.urlApiBase = this.env['api']['url'];
    this.controlador = 'documentos-hoja-ruta';
  }
}
