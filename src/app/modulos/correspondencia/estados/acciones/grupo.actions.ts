import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Grupo } from '../../modelos';
import { GrupoFilter } from '../../modelos/filtros';

export const establecerFiltroGrupo = createAction(
  '[CORRESPONDENCIA] Establecer filtro GRUPO',
  props<{ filtro: GrupoFilter }>()
);
export const establecerListaGrupo = createAction(
  '[CORRESPONDENCIA] Establecer lista GRUPO',
  props<{ lista: Grupo[]; paginado: Paginado }>()
);
export const establecerGrupo = createAction(
  '[CORRESPONDENCIA] Establecer objeto GRUPO',
  props<{ objeto: Grupo }>()
);
