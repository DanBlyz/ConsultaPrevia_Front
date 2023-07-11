import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ProvidenciaFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-providencia-buscador',
  templateUrl: './providencia-buscador.component.html',
  styles: []
})
export class ProvidenciaBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ProvidenciaFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      correlativo: [''],
      referencia: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      correlativo: this.objeto?.correlativo || '',
      referencia: this.objeto?.referencia || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ProvidenciaFilter;
    this.accion.emit({
      accion: 'buscar',
      providencia: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      correlativo: '',
      referencia: ''
    });
  }
}
