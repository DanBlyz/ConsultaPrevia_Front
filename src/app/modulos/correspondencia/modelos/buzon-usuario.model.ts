export class BuzonUsuario {
  id?: number;
  tipoAcceso: string;
  codCuenta: string;
  nombre: string;
  iniciales: string;
  fecInicio: Date;
  fecConclusion?: Date;
  estado: string;
  buzonId: number;
  refPersonaId: number;
  refUniOrganizacionalId: number;

  buzonUniOrganizacional: string;
  buzonPuesto: string;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
