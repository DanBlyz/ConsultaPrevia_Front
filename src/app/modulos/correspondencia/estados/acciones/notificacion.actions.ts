import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Notificacion } from '../../modelos';
import { NotificacionFilter } from '../../modelos/filtros';

export const establecerFiltroNotificacion = createAction(
  '[CORRESPONDENCIA] Establecer filtro Notificacion',
  props<{ filtro: NotificacionFilter }>()
);
export const establecerListaNotificacion = createAction(
  '[CORRESPONDENCIA] Establecer lista Notificacion',
  props<{ lista: Notificacion[]; paginado: Paginado }>()
);
export const establecerNotificacion = createAction(
  '[CORRESPONDENCIA] Establecer objeto Notificacion',
  props<{ objeto: Notificacion }>()
);
