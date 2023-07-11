import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PaginadorComponent } from './componentes';
import {
  SePuedeEliminarDirective,
  SePuedeModificarDirective
} from './directivas';

@NgModule({
  declarations: [
    PaginadorComponent,
    SePuedeModificarDirective,
    SePuedeEliminarDirective
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    PaginadorComponent,
    SePuedeModificarDirective,
    SePuedeEliminarDirective
  ]
})
export class ComunModule {}
