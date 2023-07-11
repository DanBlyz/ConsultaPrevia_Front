import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Parametro } from '../../modelos';
import { ParametroFilter } from '../../modelos/filtros';

export const establecerFiltroParametro = createAction(
  '[CORRESPONDENCIA] Establecer filtro PARAMETRO',
  props<{ filtro: ParametroFilter }>()
);
export const establecerListaParametro = createAction(
  '[CORRESPONDENCIA] Establecer lista PARAMETRO',
  props<{ lista: Parametro[]; paginado: Paginado }>()
);
export const establecerParametro = createAction(
  '[CORRESPONDENCIA] Establecer objeto PARAMETRO',
  props<{ objeto: Parametro }>()
);
