import { Notificacion } from "./notificacion.model";

export class Reunion {
    id?: number;
    fk_idNotificacion: number;
    nroReunion: string;
    conAcuerdo: boolean;
    sinAcuerdo: boolean;
    motivo: string;
    reunionRealizada: boolean;
    actaReunionPdf: string;
    estado?: string;
    flujo?: string;

    notificacion?: Notificacion;
  }
  