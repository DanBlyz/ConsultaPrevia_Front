export class Parametro {
  id?: number;
  tipo: string;
  orden: number;
  valor: string;
  texto: string;
  estaActivo: boolean;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
