export class Contacto {
  id?: number;
  nombre: string;
  puesto: string;
  uniOrganizacional: string;
  entidad: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
