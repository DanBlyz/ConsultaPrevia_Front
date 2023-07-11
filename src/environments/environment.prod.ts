declare let require: any;

const env = require('../../env.json');

export const environment = {
  production: true,

  entidad:
    'Autoridad Jurisdiccional Adminsitrativa Minera - AJAM',
  aplicacion: 'sgdd',
  denominacion: 'Sistema de Gestión Documental Digital',
  version: require('../../package.json').version,

  paginaAutenticacion: 'autenticacion',
  paginaInicio: '/',

  ...env
};
