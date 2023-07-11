export class Buzon {
  id?: number;
  uniOrganizacional: string;
  puesto: string;
  nivelJerarquico: number;
  esReceptorCorrespondenciaExterna: boolean;
  estado: string;
  refUniOrganizacionalId: number;
  refPuestoId: number;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
