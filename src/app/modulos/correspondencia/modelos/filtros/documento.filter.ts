import { TramiteFilter } from "./tramite.filter";

export class DocumentoFilter {
  fk_idTramite?: number;
  correlativo?: string;
  referencia?: string;
  documentoPdf?: string;
  tipoDocumento?: string;
  flujo?: string;

  tramite?: TramiteFilter;
}
