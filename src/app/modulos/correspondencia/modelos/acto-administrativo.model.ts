import { PagoCpt, Tramite, Viaje } from ".";

export class ActoAdministrativo {
    id?: number;
    fk_idTramite?: number;
    viajeRealizado: boolean;
    flujo?: string;
    encargado?: string;
    estado?: string;
    pagoCpt?: PagoCpt;
    tramite?: Tramite;
    viaje?: Viaje;
  }
  