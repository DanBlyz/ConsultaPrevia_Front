import { Paginado } from 'src/app/comun/modelos';

import {
  TipoDocumento,
  Contacto,
  Clasificacion,
  Contenido,
  Buzon,
  BuzonUsuario,
  Documento,
  HojaRuta,
  Plantilla,
  Parametro,
  Seguimiento,
  Grupo,
  GrupoBuzon,
  DocumentoHojaRuta,
  Rol,
  Usuario,
  Cuenta,
  Tramite,
  Providencia,
  Notificacion,
  ActoAdministrativo,
  PagoCpt,
  Viaje,
  Informe,
  Resolucion,
  Reunion
} from '../modelos';
import {
  TipoDocumentoFilter,
  BuzonFilter,
  DocumentoFilter,
  HojaRutaFilter,
  PlantillaFilter,
  ParametroFilter,
  SeguimientoFilter,
  ContactoFilter,
  GrupoFilter,
  DocumentoHojaRutaFilter,
  RolFilter,
  UsuarioFilter,
  CuentaFilter,
  TramiteFilter,
  ProvidenciaFilter,
  NotificacionFilter,
  ActoAdministrativoFilter,
  PagoCptFilter,
  ViajeFilter,
  InformeFilter,
  ResolucionFilter,
  ReunionFilter
} from '../modelos/filtros';

export interface CorrespondenciaState {
  listaTipoDocumento: {
    filtro: TipoDocumentoFilter;
    paginado: Paginado;
    lista: TipoDocumento[];
  };
  tipoDocumento: TipoDocumento;

  listaContacto: {
    filtro: ContactoFilter;
    paginado: Paginado;
    lista: Contacto[];
  };
  contacto: Contacto;

  listaClasificacion: {
    lista: Clasificacion[];
  };
  clasificacion: Clasificacion;

  listaBuzon: {
    filtro: BuzonFilter;
    paginado: Paginado;
    lista: Buzon[];
  };
  buzon: Buzon;

  listaBuzonUsuario: {
    paginado: Paginado;
    lista: BuzonUsuario[];
  };
  buzonUsuario: BuzonUsuario;

  listaDocumento: {
    filtro: DocumentoFilter;
    paginado: Paginado;
    lista: Documento[];
  };
  documento: Documento;
  contenido: Contenido;

  listaHojaRuta: {
    filtro: HojaRutaFilter;
    paginado: Paginado;
    lista: HojaRuta[];
  };
  hojaRuta: HojaRuta;

  listaParametro: {
    filtro: ParametroFilter;
    paginado: Paginado;
    lista: Parametro[];
  };
  parametro: Parametro;

  listaPlantilla: {
    filtro: PlantillaFilter;
    paginado: Paginado;
    lista: Plantilla[];
  };
  plantilla: Plantilla;

  listaSeguimiento: {
    filtro: SeguimientoFilter;
    paginado: Paginado;
    lista: Seguimiento[];
  };
  seguimiento: Seguimiento;

  listaGrupo: {
    filtro: GrupoFilter;
    paginado: Paginado;
    lista: Grupo[];
  };
  grupo: Grupo;

  listaGrupoBuzon: {
    paginado: Paginado;
    lista: GrupoBuzon[];
  };
  grupoBuzon: GrupoBuzon;

  listaDocumentoHojaRuta: {
    filtro: DocumentoHojaRutaFilter;
    paginado: Paginado;
    lista: DocumentoHojaRuta[];
  };
  documentoHojaRuta: DocumentoHojaRuta;

  listaRol: {
    filtro: RolFilter;
    paginado: Paginado;
    lista: Rol[];
  };
  rol: Rol;

  listaUsuario: {
    filtro: UsuarioFilter;
    paginado: Paginado;
    lista: Usuario[];
  };
  usuario: Usuario;

  listaCuenta: {
    filtro: CuentaFilter;
    paginado: Paginado;
    lista: Cuenta[];
  };
  cuenta: Cuenta;

  listaTramite: {
    filtro: TramiteFilter;
    paginado: Paginado;
    lista: Tramite[];
  };
  tramite: Tramite;

  listaProvidencia: {
    filtro: ProvidenciaFilter;
    paginado: Paginado;
    lista: Providencia[];
  };
  providencia: Providencia;

  listaNotificacion: {
    filtro: NotificacionFilter;
    paginado: Paginado;
    lista: Notificacion[];
  };
  notificacion: Notificacion;

  listaActoAdministrativo: {
    filtro: ActoAdministrativoFilter;
    paginado: Paginado;
    lista: ActoAdministrativo[];
  };
  actoAdministrativo: ActoAdministrativo;

  listaPagoCpt: {
    filtro: PagoCptFilter;
    paginado: Paginado;
    lista: PagoCpt[];
  };
  pagoCpt: PagoCpt;

  listaViaje: {
    filtro: ViajeFilter;
    paginado: Paginado;
    lista: Viaje[];
  };
  viaje: Viaje;

  listaInforme: {
    filtro: InformeFilter;
    paginado: Paginado;
    lista: Informe[];
  };
  informe: Informe;

  listaResolucion: {
    filtro: ResolucionFilter;
    paginado: Paginado;
    lista: Resolucion[];
  };
  resolucion: Resolucion;

  listaReunion: {
    filtro: ReunionFilter;
    paginado: Paginado;
    lista: Reunion[];
  };
  reunion: Reunion;
}
