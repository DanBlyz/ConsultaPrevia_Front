import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { DocumentoHojaRuta } from '../../modelos';
import { DocumentoHojaRutaFilter } from '../../modelos/filtros';

export const establecerFiltroDocumentoHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer filtro DOCUMENTO HOJA RUTA',
  props<{ filtro: DocumentoHojaRutaFilter }>()
);
export const establecerListaDocumentoHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer lista DOCUMENTO HOJA RUTA',
  props<{ lista: DocumentoHojaRuta[]; paginado: Paginado }>()
);
export const establecerDocumentoHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer objeto DOCUMENTO HOJA RUTA',
  props<{ objeto: DocumentoHojaRuta }>()
);
