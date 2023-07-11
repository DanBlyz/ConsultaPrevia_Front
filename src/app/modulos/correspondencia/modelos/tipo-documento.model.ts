export class TipoDocumento {
  id?: number;
  sigla: string;
  nombre: string;
  descripcion?: string;
  remitente: string;
  destinatario: string;
  conPlantilla: boolean;
  esPublico: boolean;
  citePorUniOrganizacional: boolean;
  estaActivo: boolean;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
