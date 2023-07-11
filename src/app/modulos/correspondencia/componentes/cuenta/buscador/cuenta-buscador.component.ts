import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { CuentaFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-cuenta-buscador',
  templateUrl: './cuenta-buscador.component.html',
  styles: []
})
export class CuentaBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: CuentaFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      codigo: [''],
      modoAutenticacion: [''],
      nombre: [''],
      contrasenia: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      codigo: this.objeto?.codigo || '',
      modoAutenticacion: this.objeto?.modoAutenticacion || '',
      nombre: this.objeto?.nombre || '',
      contrasenia: this.objeto?.contrasenia || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as CuentaFilter;
    this.accion.emit({
      accion: 'buscar',
      cuenta: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      codigo: '',
      modoAutenticacion: '',
      nombre: '',
      contrasenia: ''
    });
  }
}
