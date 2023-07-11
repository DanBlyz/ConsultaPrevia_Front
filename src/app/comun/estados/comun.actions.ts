import { createAction, props } from '@ngrx/store';

import { Respuesta } from '../modelos';

export const establecerProcesando = createAction(
  '[COMUN] Establecer PROCESANDO',
  props<{ procesando: boolean }>()
);

export const establecerMensaje = createAction(
  '[COMUN] Establecer MENSAJE',
  props<{ titulo?: string; mensaje?: string }>()
);
export const limpiarMensaje = createAction('[COMUN] Limpiar MENSAJE');

export const establecerRespuesta = createAction(
  '[COMUN] Establecer RESPUESTA',
  props<{ respuesta: Respuesta }>()
);
export const limpiarRespuesta = createAction('[COMUN] Limpiar RESPUESTA');

export const establecerNotificacion = createAction(
  '[COMUN] Establecer NOTIFICACION',
  props<{ respuesta: Respuesta }>()
);
export const limpiarNotificacion = createAction('[COMUN] Limpiar NOTIFICACION');
