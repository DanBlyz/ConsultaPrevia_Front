import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { GrupoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-grupo-buscador',
  templateUrl: './grupo-buscador.component.html',
  styles: []
})
export class GrupoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: GrupoFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      nombre: [''],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      nombre: this.objeto?.nombre || '',
      descripcion: this.objeto?.descripcion || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as GrupoFilter;
    this.accion.emit({
      accion: 'buscar',
      buzon: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      nombre: '',
      descripcion: ''
    });
  }
}
