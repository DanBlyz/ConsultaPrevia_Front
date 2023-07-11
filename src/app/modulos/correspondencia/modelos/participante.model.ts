export class Participante {
  id?: number;
  tipo: string;
  docAprobado?: boolean;
  nombre: string;
  puesto: string;
  uniOrganizacional: string;
  entidad: string;
  documentoId: number;
  buzonId: number;
  codigoGrupo?: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
