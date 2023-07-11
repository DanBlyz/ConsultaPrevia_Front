import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { BuzonFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-buzon-buscador',
  templateUrl: './buzon-buscador.component.html',
  styles: []
})
export class BuzonBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: BuzonFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      uniOrganizacional: [''],
      puesto: [''],
      estado: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      uniOrganizacional: this.objeto?.uniOrganizacional || '',
      puesto: this.objeto?.puesto || '',
      estado: this.objeto?.estado || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as BuzonFilter;
    this.accion.emit({
      accion: 'buscar',
      buzon: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      uniOrganizacional: '',
      puesto: '',
      estado: ''
    });
  }
}
