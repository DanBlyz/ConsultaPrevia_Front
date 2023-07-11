import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { ActoAdministrativo } from '../../modelos';
import { ActoAdministrativoFilter } from '../../modelos/filtros';

export const establecerFiltroActoAdministrativo = createAction(
  '[CORRESPONDENCIA] Establecer filtro ActoAdministrativo',
  props<{ filtro: ActoAdministrativoFilter }>()
);
export const establecerListaActoAdministrativo = createAction(
  '[CORRESPONDENCIA] Establecer lista ActoAdministrativo',
  props<{ lista: ActoAdministrativo[]; paginado: Paginado }>()
);
export const establecerActoAdministrativo = createAction(
  '[CORRESPONDENCIA] Establecer objeto ActoAdministrativo',
  props<{ objeto: ActoAdministrativo }>()
);
