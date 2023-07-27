import { PagoCpt, Resolucion, Tramite, Viaje } from ".";

export class ActoAdministrativo {
    id?: number;
    fk_idTramite?: number;
    fk_idResolucion?: number;
    viajeRealizado: boolean;
    flujo?: string;
    estado?: string;

    pagoCpt?: PagoCpt;
    tramite?: Tramite;
    resolucion?: Resolucion;
    viaje?: Viaje;
  }
  