import { TramiteFilter } from "./tramite.filter";
export class NotificacionFilter {
    fk_idTramite?: number;
    notificado?: string;
    direccionDpto?: string;
    notificacionPdf?: string;
    flujo?: string;
    representanteMinero?: boolean;
    representanteComunidad?: boolean;
    sifde?: boolean;
    comunidad?: string;
    nroReunion?: string;

    tramite?:TramiteFilter;
  }
  