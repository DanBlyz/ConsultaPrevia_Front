import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Resolucion } from '../../modelos';
import { ResolucionFilter } from '../../modelos/filtros';

export const establecerFiltroResolucion = createAction(
  '[CORRESPONDENCIA] Establecer filtro Resolucion',
  props<{ filtro: ResolucionFilter }>()
);
export const establecerListaResolucion = createAction(
  '[CORRESPONDENCIA] Establecer lista Resolucion',
  props<{ lista: Resolucion[]; paginado: Paginado }>()
);
export const establecerResolucion = createAction(
  '[CORRESPONDENCIA] Establecer objeto Resolucion',
  props<{ objeto: Resolucion }>()
);
