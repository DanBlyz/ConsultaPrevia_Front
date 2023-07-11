import { Respuesta } from '../modelos';

export interface ComunState {
  procesando: boolean;
  titulo: string;
  mensaje: string;
  respuesta: Respuesta;
  notificacion: Respuesta;
}
