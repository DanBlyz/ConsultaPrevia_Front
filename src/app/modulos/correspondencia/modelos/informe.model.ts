import { SujetoIdentificado } from '.';

export class Informe {
  id?: number;
  fk_idTramite: number;
  correlativo: number;
  referencia: string;
  informePdf: string;
  asunto: string;
  encargado: Date;
  flujo: string;

  listaSujetoIdentificado?: SujetoIdentificado[];
}
