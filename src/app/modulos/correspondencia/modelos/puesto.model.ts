export class Puesto {
  id?: number;
  nombre: string;
  descripcion: string;
  nivelJerarquico: number;
  estaActivo: boolean;
  uniOrganizacionalId: number;

  uniOrganizacionalNombre: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
