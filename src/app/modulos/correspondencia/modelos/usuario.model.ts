export class Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  nomPublico: string;
  correoElectronico: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
