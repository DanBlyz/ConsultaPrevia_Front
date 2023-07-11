import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { TramiteFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-tramite-buscador',
  templateUrl: './tramite-buscador.component.html',
  styles: []
})
export class TramiteBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: TramiteFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      correlativo: [''],
      codigoUnico: [''],
      areaMinera: [''],
      departamento: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      correlativo: this.objeto?.correlativo || '',
      codigoUnico: this.objeto?.codigoUnico || '',
      areaMinera: this.objeto?.areaMinera || '',
      departamento: this.objeto?.departamento || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as TramiteFilter;
    this.accion.emit({
      accion: 'buscar',
      tramite: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      correlativo: '',
      codigoUnico: '',
      areaMinera: '',
      departamento: ''
    });
  }
}
