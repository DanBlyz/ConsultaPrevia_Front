import { MenuItem } from 'src/app/comun/modelos';

export const CorrespondenciaMenu: MenuItem[] = [
  {
    ruta: '',
    titulo: 'CONSULTA PREVIA',
    icono: '',
    class: 'nav-header',
    esEnlace: false,
    submenu: [],
    roles: []
  },
  {
    ruta: 'panel',
    titulo: 'PANEL',
    icono: 'fas fa-users',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
 /* {
    ruta: '#',
    titulo: 'Administración',
    icono: 'fas fa-user-lock',
    class: '',
    esEnlace: true,
    submenu: [
      {
        ruta: '/correspondencia/parametros',
        titulo: 'Parámetros',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/tipos-documento',
        titulo: 'Tipos de documento',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      /*{
        ruta: '/correspondencia/plantillas',
        titulo: 'Plantillas',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/clasificaciones',
        titulo: 'Clasificaciones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/buzones',
        titulo: 'Buzones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/contactos',
        titulo: 'Contactos',
        icono: 'fas fa-address-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/cuentas',
        titulo: 'Cuentas',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/grupos',
        titulo: 'Grupos',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/roles',
        titulo: 'Roles',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/usuarios',
        titulo: 'Usuarios',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      }
    ],
    roles: []
  },*/
  {
    ruta: '#',
    titulo: 'IDENTIFICACION',
    icono: 'fas fa-search',
    class: '',
    esEnlace: true,
    submenu: [
      /*{
        ruta: '/correspondencia/parametros',
        titulo: 'Parámetros',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },*/
      {
        ruta: 'Identificacion/tramites',
        titulo: 'Tramites',
        icono: 'far fa-clipboard',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/providencias',
        titulo: 'Providencias',
        icono: 'far fa-file-alt',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/notificaciones',
        titulo: 'Notificaciones',
        icono: 'far fa-envelope-open',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/actos-administrativos',
        titulo: 'Actos Administrativos',
        icono: 'fas fa-paste',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/pagos-cpt',
        titulo: 'Pagos Cpt',
        icono: 'far fa-money-bill-alt',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/viaje',
        titulo: 'Viaje',
        icono: 'fas fa-map-marked-alt',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/informe',
        titulo: 'Informe',
        icono: 'fas fa-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/documento',
        titulo: 'Documento',
        icono: 'fas fa-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/sujeto-identificado',
        titulo: 'Sujeto Identificado',
        icono: 'fas fa-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      /*{
        ruta: '/correspondencia/plantillas',
        titulo: 'Plantillas',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/clasificaciones',
        titulo: 'Clasificaciones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: '/correspondencia/buzones',
        titulo: 'Buzones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },*/
    ],
    roles: []
  },
  {
    ruta: '#',
    titulo: 'DELIBERACION',
    icono: 'fas fa-people-arrows',
    class: '',
    esEnlace: true,
    submenu: [
      {
        ruta: 'Deliberacion/notificacion',
        titulo: 'Notificaciones',
        icono: 'far fa-envelope-open',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Deliberacion/resolucion',
        titulo: 'Resoluciones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Deliberacion/acto-administrativo',
        titulo: 'Actos Administrativos',
        icono: 'fas fa-paste',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Deliberacion/reunion',
        titulo: 'Reuniones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Deliberacion/informe',
        titulo: 'Informes',
        icono: 'fas fa-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Deliberacion/documento',
        titulo: 'Documentos',
        icono: 'fas fa-book',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
    ],
    roles: []
  },
  {
    ruta: '#',
    titulo: 'MEDIACION',
    icono: 'fas fa-users',
    class: '',
    esEnlace: true,
    submenu: [
      {
        ruta: 'Mediacion/resolucion',
        titulo: 'Resoluciones',  
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Mediacion/reunion',
        titulo: 'Reuniones',  
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
    ],
    roles: []
  }
  /*/{
    ruta: '/correspondencia/bandeja-borradores',
    titulo: 'Borradores',
    icono: 'fas fa-inbox',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/bandeja-entrada',
    titulo: 'Bandeja de Entrada',
    icono: 'fas fa-inbox',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/bandeja-salida',
    titulo: 'Bandeja de Salida',
    icono: 'fas fa-inbox',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/bandeja-enviados',
    titulo: 'Bandeja de Enviados',
    icono: 'fas fa-inbox',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/bandeja-archivados',
    titulo: 'Bandeja de Archivados',
    icono: 'fas fa-inbox',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/archivo',
    titulo: 'Archivo',
    icono: 'fas fa-folder-open',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  },
  {
    ruta: '/correspondencia/archivo-central',
    titulo: 'Archivo central',
    icono: 'fas fa-folder-open',
    class: '',
    esEnlace: true,
    submenu: [],
    roles: []
  }*/
];
