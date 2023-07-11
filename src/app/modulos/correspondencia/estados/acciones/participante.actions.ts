import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Participante } from '../../modelos';

export const establecerListaParticipante = createAction(
  '[CORRESPONDENCIA] Establecer lista PARTICIPANTE',
  props<{ lista: Participante[]; paginado: Paginado }>()
);
export const establecerParticipante = createAction(
  '[CORRESPONDENCIA] Establecer objeto PARTICIPANTE',
  props<{ objeto: Participante }>()
);
