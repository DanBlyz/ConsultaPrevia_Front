import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';

import * as comunReducer from './comun/estados';
import * as autenticacionReducer from './seguridad/estados';

import * as correspondenciaReducer from './modulos/correspondencia/estados';

export const appReducers: ActionReducerMap<AppState> = {
  comun: comunReducer.reducer,
  autenticacion: autenticacionReducer.reducer,
  correspondencia: correspondenciaReducer.reducer
};
