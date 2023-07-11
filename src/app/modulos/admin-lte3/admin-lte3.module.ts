import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { ComunModule } from 'src/app/comun';
import { SeguridadModule } from 'src/app/seguridad';
import {
  AutenticacionComponent,
  AutenticacionLdapComponent,
  CambiarContraseniaComponent,
  ContenedorComponent,
  EncabezadoComponent,
  MenuLateralComponent,
  NoEncontradoComponent,
  PerfilComponent,
  PieComponent,
  RecuperarContraseniaComponent,
  RegistrarseComponent,
  TerminosComponent,
  UbicacionComponent
} from './componentes';

@NgModule({
  declarations: [
    AutenticacionComponent,
    AutenticacionLdapComponent,
    EncabezadoComponent,
    MenuLateralComponent,
    PieComponent,
    UbicacionComponent,
    ContenedorComponent,
    NoEncontradoComponent,
    TerminosComponent,
    PerfilComponent,
    CambiarContraseniaComponent,
    RecuperarContraseniaComponent,
    RegistrarseComponent
  ],
  exports: [
    AutenticacionComponent,
    AutenticacionLdapComponent,
    EncabezadoComponent,
    MenuLateralComponent,
    PieComponent,
    UbicacionComponent,
    ContenedorComponent,
    NoEncontradoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ComunModule,
    SeguridadModule,
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule
  ]
})
export class AdminLte3Module {}
