import { Informe } from "./informe.model";

export class SujetoIdentificado {
    id?: number;
    fk_idInforme?: number;
    comunidad: string;
    autoridad: string;
    telefono?: number;

    informe?: Informe;
  }
  