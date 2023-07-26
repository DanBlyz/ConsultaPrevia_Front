import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { SujetoIdentificadoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-sujeto-identificado-buscador',
  templateUrl: './sujeto-identificado-buscador.component.html',
  styles: []
})
export class SujetoIdentificadoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: SujetoIdentificadoFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      comunidad: [''],
      autoridad: [''],
      telefono: [0]
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      comunidad: this.objeto?.comunidad || '',
      autoridad: this.objeto?.autoridad || '',
      telefono: this.objeto?.telefono || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as SujetoIdentificadoFilter;
    this.accion.emit({
      accion: 'buscar',
      sujetoIdentificado: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      comunidad: '',
      autoridad: '',
      telefono: ''
    });
  }
}
