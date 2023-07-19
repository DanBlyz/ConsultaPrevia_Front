import { Notificacion } from "./notificacion.model";

export class Reunion {
    id?: number;
    fk_idNotificacion: number;
    nroReunion: string;
    acuerdo: boolean;
    motivo: string;
    reunionRealizada: boolean;
    actaReunionPdf: boolean;
    encargado: string;

    notificacion?: Notificacion;
  }
  