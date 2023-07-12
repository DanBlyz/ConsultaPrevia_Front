import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { PagoCptFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-pago-cpt-buscador',
  templateUrl: './pago-cpt-buscador.component.html',
  styles: []
})
export class PagoCptBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: PagoCptFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      encargado: [''],
      apm: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      encargado: this.objeto?.encargado || '',
      apm: this.objeto?.apm || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as PagoCptFilter;
    this.accion.emit({
      accion: 'buscar',
      pagoCpt: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      encargado: '',
      apm: ''
    });
  }
}
