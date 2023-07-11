import { Documento } from '.';

export class HojaRuta {
  id?: number;
  gestion: number;
  numero: number;
  fecha: Date;
  estado: string;

  listaDocumento: Documento[];

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
