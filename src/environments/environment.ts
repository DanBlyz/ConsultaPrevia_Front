// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

declare let require: any;

const env = require('../../env.json');

export const environment = {
  production: false,

  modoAislado: false,

  entidad:
    'Autoridad Jurisdiccional Administrativa Minera  - AJAM',
  aplicacion: 'sgdd',
  denominacion: 'Sistema de Gestión de Usuarios',
  version: require('../../package.json').version + '-dev',

  paginaAutenticacion: 'autenticacion/ldap',
  paginaInicio: '/',

  ...env
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
