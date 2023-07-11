import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Rol } from '../../modelos';
import { RolFilter } from '../../modelos/filtros';

export const establecerFiltroRol = createAction(
  '[CORRESPONDENCIA] Establecer filtro ROL',
  props<{ filtro: RolFilter }>()
);
export const establecerListaRol = createAction(
  '[CORRESPONDENCIA] Establecer lista ROL',
  props<{ lista: Rol[]; paginado: Paginado }>()
);
export const establecerRol = createAction(
  '[CORRESPONDENCIA] Establecer objeto ROL',
  props<{ objeto: Rol }>()
);
