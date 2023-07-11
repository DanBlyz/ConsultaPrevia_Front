import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

import { DocumentoDinamicoDirective } from './auxiliares/directivas';
import {
  EncabezadoPipe,
  LineaPipe,
  MembretePipe,
  PiePipe,
  ReferenciaPipe,
  TituloPipe
} from './auxiliares/pipes';
import {
  DocumentoComponent,
  MenuContextualComponent,
  MenuComponent
} from './componentes';
import {
  AdjuntosComponent,
  CiteExternoComponent,
  ContenidoComponent,
  DesconocidoComponent,
  EncabezadoComponent,
  EspacioComponent,
  FechaComponent,
  FirmaDigitalComponent,
  LineaComponent,
  MembreteComponent,
  ParticipantesComponent,
  PieComponent,
  ReferenciaComponent,
  ReferenciaFinalComponent,
  RemitenteExternoComponent,
  TextoComponent,
  TituloComponent
} from './componentes/bloques';

@NgModule({
  declarations: [
    DocumentoDinamicoDirective,
    MembreteComponent,
    EncabezadoComponent,
    ParticipantesComponent,
    ReferenciaComponent,
    FechaComponent,
    ContenidoComponent,
    FirmaDigitalComponent,
    ReferenciaFinalComponent,
    PieComponent,
    LineaComponent,
    DocumentoComponent,
    MenuContextualComponent,
    TituloComponent,
    DesconocidoComponent,
    MenuComponent,
    MembretePipe,
    TituloPipe,
    EncabezadoPipe,
    LineaPipe,
    PiePipe,
    AdjuntosComponent,
    TextoComponent,
    ReferenciaPipe,
    EspacioComponent,
    CiteExternoComponent,
    RemitenteExternoComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EditorModule],
  exports: [DocumentoComponent, MenuComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class CorrespondenciaPlantillaModule {}
