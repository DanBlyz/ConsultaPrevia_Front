import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Informe } from '../../modelos';
import { InformeFilter } from '../../modelos/filtros';

export const establecerFiltroInforme = createAction(
  '[CORRESPONDENCIA] Establecer filtro Informe',
  props<{ filtro: InformeFilter }>()
);
export const establecerListaInforme = createAction(
  '[CORRESPONDENCIA] Establecer lista Informe',
  props<{ lista: Informe[]; paginado: Paginado }>()
);
export const establecerInforme = createAction(
  '[CORRESPONDENCIA] Establecer objeto Informe',
  props<{ objeto: Informe }>()
);
