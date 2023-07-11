import { createAction, props } from '@ngrx/store';

import { Paginado } from 'src/app/comun/modelos';

import { Contacto } from '../../modelos';
import { ContactoFilter } from '../../modelos/filtros';

export const establecerFiltroContacto = createAction(
  '[CORRESPONDENCIA] Establecer filtro CONTACTO',
  props<{ filtro: ContactoFilter }>()
);
export const establecerListaContacto = createAction(
  '[CORRESPONDENCIA] Establecer lista CONTACTO',
  props<{ lista: Contacto[]; paginado: Paginado }>()
);
export const establecerContacto = createAction(
  '[CORRESPONDENCIA] Establecer objeto CONTACTO',
  props<{ objeto: Contacto }>()
);
