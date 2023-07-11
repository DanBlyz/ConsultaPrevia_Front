import { createAction, props } from '@ngrx/store';

import { UsuarioAutenticado } from '../modelos';

export const iniciarSesion = createAction(
  '[AUTENTICACION] Iniciar sesion',
  props<{ usuario: UsuarioAutenticado }>()
);
export const actualizarSesion = createAction(
  '[AUTENTICACION] Actualizar sesion',
  props<{ usuario: UsuarioAutenticado }>()
);
export const cerrarSesion = createAction('[AUTENTICACION] Cerrar sesion');
