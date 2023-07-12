import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ViajeFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-viaje-buscador',
  templateUrl: './viaje-buscador.component.html',
  styles: []
})
export class ViajeBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ViajeFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      descripcion: [''],
      nroFormulario: [''],
      formularioPdf: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      fechaInicio: this.objeto?.fechaInicio || '',
      fechaFin: this.objeto?.fechaFin || '',
      descripcion: this.objeto?.descripcion || '',
      nroFormulario: this.objeto?.nroFormulario || '',
      formularioPdf: this.objeto?.formularioPdf || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ViajeFilter;
    this.accion.emit({
      accion: 'buscar',
      viaje: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      fechaInicio: '',
      fechaFin: '',
      descripcion: '',
      nroFormulario: '',
      formularioPdf: ''
    });
  }
}
