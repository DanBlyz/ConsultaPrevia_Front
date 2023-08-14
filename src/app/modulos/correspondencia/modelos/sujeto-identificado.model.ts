import { Documento } from "./documento.model";

export class SujetoIdentificado {
    id?: number;
    fk_idInforme?: number;
    comunidad: string;
    autoridad: string;
    telefono?: number;

    documento?: Documento;
  }
  