import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ResolucionFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-resolucion-buscador',
  templateUrl: './resolucion-buscador.component.html',
  styles: []
})
export class ResolucionBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ResolucionFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      informe: [''],
      resolucion: [''],
      asunto: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      informe: this.objeto?.informe || '',
      resolucion: this.objeto?.resolucion || '',
      asunto: this.objeto?.asunto || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ResolucionFilter;
    this.accion.emit({
      accion: 'buscar',
      resolucion: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      informe: '',
      resolucion: '',
      asunto: ''
    });
  }
}
