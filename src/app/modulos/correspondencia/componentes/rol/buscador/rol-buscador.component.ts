import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { RolFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-rol-buscador',
  templateUrl: './rol-buscador.component.html',
  styles: []
})
export class RolBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: RolFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      codigo: [''],
      nombre: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      codigo: this.objeto?.codigo || '',
      nombre: this.objeto?.nombre || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as RolFilter;
    this.accion.emit({
      accion: 'buscar',
      buzon: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      codigo: '',
      nombre: ''
    });
  }
}
