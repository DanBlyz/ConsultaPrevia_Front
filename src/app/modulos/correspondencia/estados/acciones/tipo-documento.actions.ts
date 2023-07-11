import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { TipoDocumento } from '../../modelos';
import { TipoDocumentoFilter } from '../../modelos/filtros';

export const establecerFiltroTipoDocumento = createAction(
  '[CORRESPONDENCIA] Establecer filtro TIPO DOCUMENTO',
  props<{ filtro: TipoDocumentoFilter }>()
);
export const establecerListaTipoDocumento = createAction(
  '[CORRESPONDENCIA] Establecer lista TIPO DOCUMENTO',
  props<{ lista: TipoDocumento[]; paginado: Paginado }>()
);
export const establecerTipoDocumento = createAction(
  '[CORRESPONDENCIA] Establecer objeto TIPO DOCUMENTO',
  props<{ objeto: TipoDocumento }>()
);
