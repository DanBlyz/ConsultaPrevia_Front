import { TramiteFilter } from "./tramite.filter";
export class ProvidenciaFilter {
    fk_idTramite?: number;
    correlativo?: string;
    referencia?: string;
    providenciaPdf?: string;
    flujo?: string;

    tramite?: TramiteFilter;
  }
  