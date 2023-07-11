import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Usuario } from '../../modelos';
import { UsuarioFilter } from '../../modelos/filtros';

export const establecerFiltroUsuario = createAction(
  '[CORRESPONDENCIA] Establecer filtro USUARIO',
  props<{ filtro: UsuarioFilter }>()
);
export const establecerListaUsuario = createAction(
  '[CORRESPONDENCIA] Establecer lista USUARIO',
  props<{ lista: Usuario[]; paginado: Paginado }>()
);
export const establecerUsuario = createAction(
  '[CORRESPONDENCIA] Establecer objeto USUARIO',
  props<{ objeto: Usuario }>()
);
