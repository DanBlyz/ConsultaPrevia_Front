import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Documento } from '../../modelos';
import { DocumentoFilter } from '../../modelos/filtros';

export const establecerFiltroDocumento = createAction(
  '[CORRESPONDENCIA] Establecer filtro DOCUMENTO',
  props<{ filtro: DocumentoFilter }>()
);
export const establecerListaDocumento = createAction(
  '[CORRESPONDENCIA] Establecer lista DOCUMENTO',
  props<{ lista: Documento[]; paginado: Paginado }>()
);
export const establecerDocumento = createAction(
  '[CORRESPONDENCIA] Establecer objeto DOCUMENTO',
  props<{ objeto: Documento }>()
);
