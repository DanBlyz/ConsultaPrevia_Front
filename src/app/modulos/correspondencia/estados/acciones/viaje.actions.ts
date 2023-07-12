import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Viaje } from '../../modelos';
import { ViajeFilter } from '../../modelos/filtros';

export const establecerFiltroViaje = createAction(
  '[CORRESPONDENCIA] Establecer filtro Viaje',
  props<{ filtro: ViajeFilter }>()
);
export const establecerListaViaje = createAction(
  '[CORRESPONDENCIA] Establecer lista Viaje',
  props<{ lista: Viaje[]; paginado: Paginado }>()
);
export const establecerViaje = createAction(
  '[CORRESPONDENCIA] Establecer objeto Viaje',
  props<{ objeto: Viaje }>()
);
