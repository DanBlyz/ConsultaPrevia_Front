import { createAction, props } from '@ngrx/store';

import { Contenido } from '../../modelos';

export const establecerContenido = createAction(
  '[CORRESPONDENCIA] Establecer objeto CONTENIDO',
  props<{ objeto: Contenido }>()
);
