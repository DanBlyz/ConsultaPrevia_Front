import { TramiteFilter } from "./tramite.filter";
export class InformeFilter {
    fk_idTramite?: number;
    correlativo?: string;
    referencia?: string;
    informePdf?: string;
    tipoDocumento?: string;
    flujo?: string;

    tramite?: TramiteFilter;
  }
  