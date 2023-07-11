import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares/funciones.helper';

import { PlantillaFilter } from '../../../modelos/filtros/plantilla.filter';

@Component({
  selector: 'app-correspondencia-plantilla-buscador',
  templateUrl: './plantilla-buscador.component.html',
  styles: []
})
export class PlantillaBuscadorComponent implements OnInit {
  @Output() operacion = new EventEmitter<any>();
  @Input() objeto: PlantillaFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      version: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      version: this.objeto?.version || ''
    });
  }

  onOperacion(): void {
    const objeto = { ...this.formBuscador.value } as PlantillaFilter;
    this.operacion.emit({
      tipoOperacion: 'buscar',
      plantilla: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      version: ''
    });
  }
}
