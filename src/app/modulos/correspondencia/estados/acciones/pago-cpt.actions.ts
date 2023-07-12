import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { PagoCpt } from '../../modelos';
import { PagoCptFilter } from '../../modelos/filtros';

export const establecerFiltroPagoCpt = createAction(
  '[CORRESPONDENCIA] Establecer filtro PagoCpt',
  props<{ filtro: PagoCptFilter }>()
);
export const establecerListaPagoCpt = createAction(
  '[CORRESPONDENCIA] Establecer lista PagoCpt',
  props<{ lista: PagoCpt[]; paginado: Paginado }>()
);
export const establecerPagoCpt = createAction(
  '[CORRESPONDENCIA] Establecer objeto PagoCpt',
  props<{ objeto: PagoCpt }>()
);
