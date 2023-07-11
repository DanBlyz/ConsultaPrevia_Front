export class GrupoBuzon {
  id?: number;
  fecInicio: Date;
  fecConclusion?: Date;
  estado: string;
  grupoId: number;
  buzonId: number;

  sePuedeModificar?: boolean;
  sePuedeEliminar?: boolean;
}
