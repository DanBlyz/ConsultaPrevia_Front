import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { HojaRuta } from '../../modelos';
import { HojaRutaFilter } from '../../modelos/filtros';

export const establecerFiltroHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer filtro HOJA RUTA',
  props<{ filtro: HojaRutaFilter }>()
);
export const establecerListaHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer lista HOJA RUTA',
  props<{ lista: HojaRuta[]; paginado: Paginado }>()
);
export const establecerHojaRuta = createAction(
  '[CORRESPONDENCIA] Establecer objeto HOJA RUTA',
  props<{ objeto: HojaRuta }>()
);
