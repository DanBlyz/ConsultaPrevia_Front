import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Seguimiento } from '../../modelos';
import { SeguimientoFilter } from '../../modelos/filtros';

export const establecerFiltroSeguimiento = createAction(
  '[CORRESPONDENCIA] Establecer filtro SEGUIMIENTO',
  props<{ filtro: SeguimientoFilter }>()
);
export const establecerListaSeguimiento = createAction(
  '[CORRESPONDENCIA] Establecer lista SEGUIMIENTO',
  props<{ lista: Seguimiento[]; paginado: Paginado }>()
);
export const establecerSeguimiento = createAction(
  '[CORRESPONDENCIA] Establecer objeto SEGUIMIENTO',
  props<{ objeto: Seguimiento }>()
);
