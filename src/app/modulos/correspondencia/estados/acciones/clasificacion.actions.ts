import { createAction, props } from '@ngrx/store';

import { Clasificacion } from '../../modelos';

export const establecerListaClasificacion = createAction(
  '[CORRESPONDENCIA] Establecer lista CLASIFICACION',
  props<{ lista: Clasificacion[] }>()
);
export const establecerClasificacion = createAction(
  '[CORRESPONDENCIA] Establecer objeto CLASIFICACION',
  props<{ objeto: Clasificacion }>()
);
