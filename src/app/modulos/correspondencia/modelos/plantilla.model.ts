export class Plantilla {
  id?: number;
  fecha: Date;
  version: number;
  estructura: string;
  estaActiva: boolean;
  tipoDocumentoId: number;

  tipoDocumentoNombre: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
