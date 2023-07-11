import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Tramite } from '../../modelos';
import { TramiteFilter } from '../../modelos/filtros';

export const establecerFiltroTramite = createAction(
  '[CORRESPONDENCIA] Establecer filtro Tramite',
  props<{ filtro: TramiteFilter }>()
);
export const establecerListaTramite = createAction(
  '[CORRESPONDENCIA] Establecer lista Tramite',
  props<{ lista: Tramite[]; paginado: Paginado }>()
);
export const establecerTramite = createAction(
  '[CORRESPONDENCIA] Establecer objeto Tramite',
  props<{ objeto: Tramite }>()
);
