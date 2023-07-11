export class Rol {
  id?: number;
  codigo: string;
  nombre: string;
  grupoId: number;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
