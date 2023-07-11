import { Buzon, Documento } from '.';

export class Seguimiento {
  id?: number;
  origen: string;
  destino?: string;
  accion: string;
  instante: Date;
  proveidoAccion?: string;
  proveido?: string;
  proveidoFirmado?: string;
  fecRecepcion?: Date;
  observacion?: string;
  esBorrador: boolean;
  estado: string;
  instActualizacion?: Date;
  documentoId: number;
  buzonIdOrigen: number;
  buzonIdDestino?: number;
  documento?: Documento;
  buzonOrigen?: Buzon;
  buzonDestino?: Buzon;

  sePuedeModificarDocumento?: boolean;
  sePuedeEliminarDocumento?: boolean;
}
