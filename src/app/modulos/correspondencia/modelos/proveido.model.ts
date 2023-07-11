import { Destinatario } from './destinatario.model';

export class Proveido {
  cite: string;
  hojaRuta: string;
  destinatarios: Destinatario[];
  acciones: string[];
  instruccion: string;
  instante: Date;
}
