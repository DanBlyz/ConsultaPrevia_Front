import { PagoCpt, Tramite } from ".";

export class ActoAdministrativo {
    id?: number;
    fk_idTramite: number;
    viajeRealizado: boolean;
    flujo: string;
    encargado: string;
    pagoCpt?: PagoCpt;
    tramite?: Tramite;
  }
  