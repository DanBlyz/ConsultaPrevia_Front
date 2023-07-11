import { ComunState } from './comun/estados';
import { AutenticacionState } from './seguridad/estados';

import { CorrespondenciaState } from './modulos/correspondencia/estados';

export interface AppState {
  comun: ComunState;
  autenticacion: AutenticacionState;
  correspondencia: CorrespondenciaState;
}
