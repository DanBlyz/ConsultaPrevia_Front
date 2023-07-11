import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Cuenta } from '../../modelos';
import { CuentaFilter } from '../../modelos/filtros';

export const establecerFiltroCuenta = createAction(
  '[CORRESPONDENCIA] Establecer filtro CUENTA',
  props<{ filtro: CuentaFilter }>()
);
export const establecerListaCuenta = createAction(
  '[CORRESPONDENCIA] Establecer lista CUENTA',
  props<{ lista: Cuenta[]; paginado: Paginado }>()
);
export const establecerCuenta = createAction(
  '[CORRESPONDENCIA] Establecer objeto CUENTA',
  props<{ objeto: Cuenta }>()
);
