export class Adjunto {
  id: number;
  tipo: string;
  codigo: string;
  tipoMime: string;
  tamanio: number;
  extension: string;
  estaFirmado: boolean;
  nomPublico: string;
  nomPrivado: string;
  estado: string;
  documentoId: number;

  archivoBase64?: string;

  sePuedeModificar: boolean;
  sePuedeEliminar: boolean;
}
