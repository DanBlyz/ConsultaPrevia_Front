export class Cuenta {
  id?: number;
  codigo: string;
  modoAutenticacion: string;
  nombre: string;
  contrasenia: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
