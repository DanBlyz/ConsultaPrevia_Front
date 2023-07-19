import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Reunion } from '../../modelos';
import { ReunionFilter } from '../../modelos/filtros';

export const establecerFiltroReunion = createAction(
  '[CORRESPONDENCIA] Establecer filtro Reunion',
  props<{ filtro: ReunionFilter }>()
);
export const establecerListaReunion = createAction(
  '[CORRESPONDENCIA] Establecer lista Reunion',
  props<{ lista: Reunion[]; paginado: Paginado }>()
);
export const establecerReunion = createAction(
  '[CORRESPONDENCIA] Establecer objeto Reunion',
  props<{ objeto: Reunion }>()
);
