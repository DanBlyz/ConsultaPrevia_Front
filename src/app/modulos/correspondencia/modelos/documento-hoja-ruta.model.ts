export class DocumentoHojaRuta {
  id?: number;
  instante: Date;
  observacion: string;
  hojaRutaOrigen: string;
  hojaRutaDestino: string;
  documentoId: number;
  hojaRutaIdOrigen: number;
  hojaRutaIdDestino: number;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
