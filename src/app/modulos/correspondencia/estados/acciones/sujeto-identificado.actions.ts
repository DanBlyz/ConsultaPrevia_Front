import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { SujetoIdentificado } from '../../modelos';
import { SujetoIdentificadoFilter } from '../../modelos/filtros';

export const establecerFiltroSujetoIdentificado = createAction(
  '[CORRESPONDENCIA] Establecer filtro SujetoIdentificado',
  props<{ filtro: SujetoIdentificadoFilter }>()
);
export const establecerListaSujetoIdentificado = createAction(
  '[CORRESPONDENCIA] Establecer lista SujetoIdentificado',
  props<{ lista: SujetoIdentificado[]; paginado: Paginado }>()
);
export const establecerSujetoIdentificado = createAction(
  '[CORRESPONDENCIA] Establecer objeto SujetoIdentificado',
  props<{ objeto: SujetoIdentificado }>()
);
