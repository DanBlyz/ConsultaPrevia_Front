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
      viajeRealizado: [''],
      encargado: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      viajeRealizado: this.objeto?.viajeRealizado || '',
      encargado: this.objeto?.encargado || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ActoAdministrativoFilter;
    this.accion.emit({
      accion: 'buscar',
      actoAdministrativo: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      viajeRealizado: '',
      encargado: ''
    });
  }
}
