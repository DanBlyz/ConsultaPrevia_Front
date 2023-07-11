import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { GrupoBuzon } from '../../modelos';

export const establecerListaGrupoBuzon = createAction(
  '[CORRESPONDENCIA] Establecer lista GRUPO BUZON',
  props<{ lista: GrupoBuzon[]; paginado: Paginado }>()
);
export const establecerGrupoBuzon = createAction(
  '[CORRESPONDENCIA] Establecer objeto GRUPO BUZON',
  props<{ objeto: GrupoBuzon }>()
);
