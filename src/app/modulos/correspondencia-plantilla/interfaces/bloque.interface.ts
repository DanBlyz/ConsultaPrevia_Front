import { Ubicacion } from '../enumeraciones';

export interface Bloque {
  componente: string;
  plantilla: string;
  uid: string;
  ubicacion: Ubicacion;
  posicion: number;
  datos?: any;
  configuracion?: any;
}
