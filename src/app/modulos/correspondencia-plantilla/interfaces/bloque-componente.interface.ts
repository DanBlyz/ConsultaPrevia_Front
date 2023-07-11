import { EventEmitter } from '@angular/core';

import { ModoVisualizacion, Ubicacion } from '../enumeraciones';
import { Bloque } from '.';

export interface BloqueComponente {
  operacion: EventEmitter<any>;
  accion: EventEmitter<any>;

  uid: string;
  ubicacion: Ubicacion;
  posicion: number;
  modoVisualizacion: ModoVisualizacion;
  datos?: any;
  configuracion?: any;
  formConfiguracion?: any;

  parametros?: any;

  establecerParametros(parametros?: any);
  obtenerBloque(): Bloque;
}
