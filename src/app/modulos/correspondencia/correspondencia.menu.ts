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
    ruta: '#',
    titulo: 'Administración',
    icono: 'fas fa-user-lock',
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
      },*/
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
  },
  {
    ruta: '#',
    titulo: 'IDENTIFICACION',
    icono: 'fas fa-user-lock',
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
        ruta: 'Identificacion/correspondencia/tramites',
        titulo: 'Tramites',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/correspondencia/providencias',
        titulo: 'Providencias',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/correspondencia/notificaciones',
        titulo: 'Notificaciones',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/correspondencia/actos-administrativos',
        titulo: 'Actos Administrativos',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/correspondencia/pagos-cpt',
        titulo: 'Pagos Cpt',
        icono: 'fas fa-cog',
        class: '',
        esEnlace: true,
        submenu: [],
        roles: []
      },
      {
        ruta: 'Identificacion/correspondencia/viaje',
        titulo: 'Viaje',
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
      },*/
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
