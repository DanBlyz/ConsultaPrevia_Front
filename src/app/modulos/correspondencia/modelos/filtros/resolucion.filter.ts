import { TramiteFilter } from "./tramite.filter";

export class ResolucionFilter {
    fk_idTramite?: number;
    informe?: string;
    correlativo?: string;
    informeAprobado?: boolean;
    actoAdministrativo?: boolean;
    resolucionPdf?: string;
    flujo?: string;
    referencia?: string;

    tramite?: TramiteFilter;
  }
  