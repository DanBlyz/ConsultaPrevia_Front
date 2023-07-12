import { Tramite } from ".";

export class ActoAdministrativo {
    id?: number;
    fk_idTramite: number;
    viajeRealizado: boolean;
    flujo: string;
    encargado: string;
    pagoRealizado: boolean;
    tramite?: Tramite;
  }
  