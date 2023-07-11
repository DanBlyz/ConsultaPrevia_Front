import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Providencia } from '../../modelos';
import { ProvidenciaFilter } from '../../modelos/filtros';

export const establecerFiltroProvidencia = createAction(
  '[CORRESPONDENCIA] Establecer filtro Providencia',
  props<{ filtro: ProvidenciaFilter }>()
);
export const establecerListaProvidencia = createAction(
  '[CORRESPONDENCIA] Establecer lista Providencia',
  props<{ lista: Providencia[]; paginado: Paginado }>()
);
export const establecerProvidencia = createAction(
  '[CORRESPONDENCIA] Establecer objeto Providencia',
  props<{ objeto: Providencia }>()
);
