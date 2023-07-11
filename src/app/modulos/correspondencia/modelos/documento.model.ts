import { Adjunto, Participante, Seguimiento } from '.';

export class Documento {
  id?: number;
  numero: number;
  gestion: number;
  cite: string;
  citeExterno: string;
  instRegistro: Date;
  lugar: string;
  fecha: Date;
  referencia: string;
  prioridad: string;
  observacion?: string;
  dandoContinuidad?: string;
  esBorrador: boolean;
  estaImpreso: boolean;
  hojaRutaId?: number;
  tipoDocumentoId: number;
  clasificacionId: number;
  estaObservado?: boolean;

  hojaRutaNumero: string;
  tipoDocumentoNombre: string;
  clasificacionNombre: string;
  tieneContenido: boolean;
  tieneDocumentoAdjunto: boolean;

  listaParticipante?: Participante[];
  listaSeguimiento?: Seguimiento[];
  listaAdjunto?: Adjunto[];

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
