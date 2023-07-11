import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Buzon } from '../../modelos';
import { BuzonFilter } from '../../modelos/filtros';

export const establecerFiltroBuzon = createAction(
  '[CORRESPONDENCIA] Establecer filtro BUZON',
  props<{ filtro: BuzonFilter }>()
);
export const establecerListaBuzon = createAction(
  '[CORRESPONDENCIA] Establecer lista BUZON',
  props<{ lista: Buzon[]; paginado: Paginado }>()
);
export const establecerBuzon = createAction(
  '[CORRESPONDENCIA] Establecer objeto BUZON',
  props<{ objeto: Buzon }>()
);
