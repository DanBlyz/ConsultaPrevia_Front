import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { InformeFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-informe-buscador',
  templateUrl: './informe-buscador.component.html',
  styles: []
})
export class InformeBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: InformeFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      correlativo: [''],
      referencia: [''],
      asunto: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      correlativo: this.objeto?.correlativo || '',
      referencia: this.objeto?.referencia || '',
      asunto: this.objeto?.asunto || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as InformeFilter;
    this.accion.emit({
      accion: 'buscar',
      informe: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      correlativo: '',
      referencia: '',
      asunto: ''
    });
  }
}
