import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ActoAdministrativoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-acto-administrativo-buscador',
  templateUrl: './acto-administrativo-buscador.component.html',
  styles: []
})
export class ActoAdministrativoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ActoAdministrativoFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      tramite: [''],
      viajeRealizado: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      tramite: this.objeto?.tramite?.correlativo || '',
      viajeRealizado: this.objeto?.viajeRealizado || '',
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ActoAdministrativoFilter;
    const correlativoBuscador = objeto.tramite+"";
    objeto.tramite = { correlativo : correlativoBuscador};
    this.accion.emit({
      accion: 'buscar',
      actoAdministrativo: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      tramite: '',
      viajeRealizado: '',
    });
  }
}
