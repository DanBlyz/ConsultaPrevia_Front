import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { BuzonUsuario } from '../../modelos';

export const establecerListaBuzonUsuario = createAction(
  '[CORRESPONDENCIA] Establecer lista BUZON USUARIO',
  props<{ lista: BuzonUsuario[]; paginado: Paginado }>()
);
export const establecerBuzonUsuario = createAction(
  '[CORRESPONDENCIA] Establecer objeto BUZON USUARIO',
  props<{ objeto: BuzonUsuario }>()
);
