import { TramiteFilter } from "./tramite.filter";
export class ActoAdministrativoFilter {
  fk_idTramite?: number;
  fk_idResolucion?: number;
  viajeRealizado?: boolean;
  flujo?: string;
  estado?: string;

  tramite?: TramiteFilter;
}
