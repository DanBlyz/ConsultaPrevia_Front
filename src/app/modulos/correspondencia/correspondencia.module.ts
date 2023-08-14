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
  DocumentoListaComponent
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
  ProvidenciaDetalleComponent,
 } from './componentes/providencia';

 import {
  NotificacionListaComponent,
  NotificacionBuscadorComponent,
  NotificacionFormularioComponent,
  NotificacionDetalleComponent
 } from './componentes/notificacion';
 import {
   ActoAdministrativoDetalleComponent,
   ActoAdministrativoListaComponent,
   ActoAdministrativoFormularioComponent,
   ActoAdministrativoBuscadorComponent
 } from './componentes/acto-administrativo';
 import {
  PagoCptListaComponent,
  PagoCptBuscadorComponent,
  PagoCptFormularioComponent,
  PagoCptDetalleComponent
 } from './componentes/pago-cpt';
 import {
  ViajeListaComponent,
  ViajeBuscadorComponent,
  ViajeFormularioComponent,
  ViajeDetalleComponent
 } from './componentes/viaje';
 import {
 InformeListaComponent,
 InformeBuscadorComponent,
 InformeFormularioComponent,
 InformeDetalleComponent
 } from './componentes/informe';
 
 import {
  ResolucionListaComponent,
  ResolucionBuscadorComponent,
  ResolucionFormularioComponent,
  ResolucionDetalleComponent
  } from './componentes/resolucion';

  import {
    ReunionListaComponent,
    ReunionBuscadorComponent,
    ReunionFormularioComponent,
    ReunionDetalleComponent
    } from './componentes/reunion';
    import {
      SujetoIdentificadoListaComponent,
      SujetoIdentificadoBuscadorComponent,
      SujetoIdentificadoFormularioComponent,
      SujetoIdentificadoDetalleComponent
      } from './componentes/sujeto-identificado';
import { PanelComponent } from './componentes/panel/panel.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
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
    DocumentoListaComponent,
    ParticipantesPipe,
    PlantillaDetalleComponent,
    PlantillaFormularioComponent,
    PlantillaBuscadorComponent,
    PlantillaListaComponent,
    ParticipanteSeleccionComponent,
    SeguimientoProveidoComponent,
    ParametroBuscadorComponent,
    ParametroDetalleComponent,
    ParametroFormularioComponent,
    ParametroListaComponent,
    SeguimientoArchivadoComponent,
    ParticipanteContactoSeleccionComponent,
    GrupoDetalleComponent,
    GrupoFormularioComponent,
    GrupoBuscadorComponent,
    GrupoListaComponent,
    GrupoBuzonDetalleComponent,
    GrupoBuzonFormularioComponent,
    GrupoBuzonListaComponent,
    ParticipanteGrupoSeleccionComponent,
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
    ActoAdministrativoDetalleComponent,
    ActoAdministrativoListaComponent,
    ActoAdministrativoFormularioComponent,
    ActoAdministrativoBuscadorComponent,
    PagoCptDetalleComponent,
    PagoCptFormularioComponent,
    PagoCptBuscadorComponent,
    PagoCptListaComponent,
    ViajeDetalleComponent,
    ViajeFormularioComponent,
    ViajeBuscadorComponent,
    ViajeListaComponent,
    InformeDetalleComponent,
    InformeFormularioComponent,
    InformeBuscadorComponent,
    InformeListaComponent,
    ResolucionDetalleComponent,
    ResolucionFormularioComponent,
    ResolucionBuscadorComponent,
    ResolucionListaComponent,
    ReunionDetalleComponent,
    ReunionFormularioComponent,
    ReunionBuscadorComponent,
    ReunionListaComponent,

    SujetoIdentificadoDetalleComponent,
    SujetoIdentificadoFormularioComponent,
    SujetoIdentificadoBuscadorComponent,
    SujetoIdentificadoListaComponent,
    PanelComponent,

  ],
  imports: [
    CommonModule,
    CorrespondenciaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ComunModule,
    CorrespondenciaPlantillaModule,
    NgxExtendedPdfViewerModule,
    AutocompleteLibModule
  ]
})
export class CorrespondenciaModule {}
