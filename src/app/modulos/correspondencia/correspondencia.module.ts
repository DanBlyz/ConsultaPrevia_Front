import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { ComunModule } from 'src/app/comun';

import { CorrespondenciaRoutingModule } from '.';
import {
  TipoDocumentoBuscadorComponent,
  TipoDocumentoDetalleComponent,
  TipoDocumentoFormularioComponent,
  TipoDocumentoListaComponent
} from './componentes/tipo-documento';
import {
  BuzonDetalleComponent,
  BuzonFormularioComponent,
  BuzonBuscadorComponent,
  BuzonListaComponent
} from './componentes/buzon';
import {
  BuzonUsuarioDetalleComponent,
  BuzonUsuarioFormularioComponent,
  BuzonUsuarioListaComponent
} from './componentes/buzon-usuario';
import {
  ClasificacionDetalleComponent,
  ClasificacionFormularioComponent,
  ClasificacionListaComponent
} from './componentes/clasificacion';
import {
  ContactoListaComponent,
  ContactoBuscadorComponent,
  ContactoFormularioComponent,
  ContactoDetalleComponent
} from './componentes/contacto';
import {
  DocumentoDetalleComponent,
  DocumentoFormularioComponent,
  DocumentoBuscadorComponent,
  DocumentoSeguimientoComponent,
  DocumentoEnviarComponent,
  DocumentoAprobarComponent,
  DocumentoDerivarComponent,
  DocumentoRecibirComponent,
  DocumentoArchivoComponent,
  DocumentoArchivoCentralComponent,
  DocumentoArchivoDetalleComponent,
  DocumentoArchivoCentralDetalleComponent,
  DocumentoAnexoComponent,
  DocumentoVistaPreviaComponent,
  DocumentoRespaldoComponent,
  DocumentoResumenComponent
} from './componentes/documento';
import { ParticipantesPipe } from './auxiliares/pipes';
import {
  PlantillaDetalleComponent,
  PlantillaFormularioComponent,
  PlantillaBuscadorComponent,
  PlantillaListaComponent
} from './componentes/plantilla';
import {
  ParametroDetalleComponent,
  ParametroFormularioComponent,
  ParametroBuscadorComponent,
  ParametroListaComponent
} from './componentes/parametro';
import { CorrespondenciaPlantillaModule } from '../correspondencia-plantilla';
import { ParticipanteSeleccionComponent } from './componentes/participante';
import {
  BandejaDetalleAprobarComponent,
  BandejaArchivadoComponent,
  BandejaDetalleArchivarComponent,
  BandejaBorradorComponent,
  BandejaDetalleDerivarComponent,
  BandejaDetalleVerComponent,
  BandejaEntradaComponent,
  BandejaEnviadoComponent,
  BandejaDetalleEnviarComponent,
  BandejaSalidaComponent,
  BandejaBuscadorComponent
} from './componentes/bandeja';
import { HojaRutaDetalleComponent } from './componentes/hoja-ruta';
import { HojaRutaVincularComponent } from './componentes/hoja-ruta';
import { ContenidoFormularioComponent } from './componentes/contenido';
import {
  SeguimientoArchivadoComponent,
  SeguimientoProveidoComponent
} from './componentes/seguimiento';
import {
  GrupoDetalleComponent,
  GrupoFormularioComponent,
  GrupoBuscadorComponent,
  GrupoListaComponent
} from './componentes/grupo';
import {
  GrupoBuzonDetalleComponent,
  GrupoBuzonFormularioComponent,
  GrupoBuzonListaComponent
} from './componentes/grupo-buzon';
import { ParticipanteContactoSeleccionComponent } from './componentes/participante-contacto';
import { ParticipanteGrupoSeleccionComponent } from './componentes/participante-grupo';
import {
  RolDetalleComponent,
  RolFormularioComponent,
  RolBuscadorComponent,
  RolListaComponent
} from './componentes/rol';
import {
  UsuarioListaComponent,
  UsuarioBuscadorComponent,
  UsuarioFormularioComponent,
  UsuarioDetalleComponent
} from './componentes/usuario';
import {
  CuentaListaComponent,
  CuentaBuscadorComponent,
  CuentaFormularioComponent,
  CuentaDetalleComponent
} from './componentes/cuenta';

import {
 TramiteListaComponent,
 TramiteBuscadorComponent,
 TramiteFormularioComponent,
 TramiteDetalleComponent
} from './componentes/tramite';

import {
  ProvidenciaListaComponent,
  ProvidenciaBuscadorComponent,
  ProvidenciaFormularioComponent,
  ProvidenciaDetalleComponent
 } from './componentes/providencia';

 import {
  NotificacionListaComponent,
  NotificacionBuscadorComponent,
  NotificacionFormularioComponent,
  NotificacionDetalleComponent
 } from './componentes/notificacion';
 import {
  ActoAdministrativoListaComponent
 } from './componentes/acto-administrativo';

@NgModule({
  declarations: [
    TipoDocumentoDetalleComponent,
    TipoDocumentoFormularioComponent,
    TipoDocumentoBuscadorComponent,
    TipoDocumentoListaComponent,
    ContactoListaComponent,
    ContactoBuscadorComponent,
    ContactoFormularioComponent,
    ContactoDetalleComponent,
    ClasificacionDetalleComponent,
    ClasificacionFormularioComponent,
    ClasificacionListaComponent,
    BuzonDetalleComponent,
    BuzonFormularioComponent,
    BuzonBuscadorComponent,
    BuzonListaComponent,
    BuzonUsuarioDetalleComponent,
    BuzonUsuarioFormularioComponent,
    BuzonUsuarioListaComponent,
    DocumentoDetalleComponent,
    DocumentoFormularioComponent,
    DocumentoBuscadorComponent,
    ParticipantesPipe,
    DocumentoSeguimientoComponent,
    PlantillaDetalleComponent,
    PlantillaFormularioComponent,
    PlantillaBuscadorComponent,
    PlantillaListaComponent,
    ParticipanteSeleccionComponent,
    BandejaBorradorComponent,
    BandejaEntradaComponent,
    BandejaEnviadoComponent,
    BandejaSalidaComponent,
    HojaRutaDetalleComponent,
    HojaRutaVincularComponent,
    DocumentoEnviarComponent,
    DocumentoAprobarComponent,
    DocumentoDerivarComponent,
    ContenidoFormularioComponent,
    SeguimientoProveidoComponent,
    BandejaDetalleEnviarComponent,
    BandejaDetalleAprobarComponent,
    BandejaDetalleDerivarComponent,
    BandejaDetalleVerComponent,
    ParametroBuscadorComponent,
    ParametroDetalleComponent,
    ParametroFormularioComponent,
    ParametroListaComponent,
    DocumentoRecibirComponent,
    BandejaArchivadoComponent,
    BandejaDetalleArchivarComponent,
    DocumentoArchivoComponent,
    DocumentoArchivoCentralComponent,
    SeguimientoArchivadoComponent,
    DocumentoArchivoDetalleComponent,
    DocumentoArchivoCentralDetalleComponent,
    DocumentoAnexoComponent,
    DocumentoVistaPreviaComponent,
    BandejaBuscadorComponent,
    ParticipanteContactoSeleccionComponent,
    DocumentoRespaldoComponent,
    GrupoDetalleComponent,
    GrupoFormularioComponent,
    GrupoBuscadorComponent,
    GrupoListaComponent,
    GrupoBuzonDetalleComponent,
    GrupoBuzonFormularioComponent,
    GrupoBuzonListaComponent,
    ParticipanteGrupoSeleccionComponent,
    DocumentoResumenComponent,
    RolDetalleComponent,
    RolFormularioComponent,
    RolBuscadorComponent,
    RolListaComponent,
    UsuarioDetalleComponent,
    UsuarioFormularioComponent,
    UsuarioBuscadorComponent,
    UsuarioListaComponent,
    CuentaDetalleComponent,
    CuentaFormularioComponent,
    CuentaBuscadorComponent,
    CuentaListaComponent,

    TramiteDetalleComponent,
    TramiteFormularioComponent,
    TramiteBuscadorComponent,
    TramiteListaComponent,
    ProvidenciaDetalleComponent,
    ProvidenciaFormularioComponent,
    ProvidenciaBuscadorComponent,
    ProvidenciaListaComponent,
    NotificacionDetalleComponent,
    NotificacionFormularioComponent,
    NotificacionBuscadorComponent,
    NotificacionListaComponent,

    ActoAdministrativoListaComponent,
  ],
  imports: [
    CommonModule,
    CorrespondenciaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ComunModule,
    CorrespondenciaPlantillaModule,
    NgxExtendedPdfViewerModule
  ]
})
export class CorrespondenciaModule {}
