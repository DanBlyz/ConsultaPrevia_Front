import { NotificacionFilter } from "./notificacion.filter";
export class ReunionFilter {
    fk_idNotificacion?: number;
    nroReunion?: string;
    conAcuerdo?: boolean;
    sinAcuerdo?: boolean;
    motivo?: string;
    reunionRealizada?: boolean;
    actaReunionPdf?: string;
    estado?: string;
    flujo?: string;

    notificacion?: NotificacionFilter

  }
  