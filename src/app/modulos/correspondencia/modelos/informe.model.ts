import { SujetoIdentificado } from '.';

export class Informe {
  id?: number;
  fk_idTramite: number;
  correlativo: string;
  referencia: string;
  informePdf: string;
  tipoDocumento: string;
  flujo: string;

  nroSujetos?: number;
  comunidad?: string;
  representante?:string;
  comunidad2?: string;
  representante2?:string;
  comunidad3?: string;
  representante3?:string;
  comunidad4?: string;
  representante4?:string;
  comunidad5?: string;
  representante6?:string;
  listaSujetoIdentificado?: SujetoIdentificado[];
}
