import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { TipoDocumentoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-tipo-documento-buscador',
  templateUrl: './tipo-documento-buscador.component.html',
  styles: []
})
export class TipoDocumentoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: TipoDocumentoFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      sigla: [''],
      nombre: [''],
      conPlantilla: [''],
      esPublico: [''],
      estaActivo: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      sigla: this.objeto?.sigla || '',
      nombre: this.objeto?.nombre || '',
      conPlantilla: this.objeto?.conPlantilla || '',
      esPublico: this.objeto?.esPublico || '',
      estaActivo: this.objeto?.estaActivo || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as TipoDocumentoFilter;
    this.accion.emit({
      accion: 'buscar',
      tipoDocumento: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      sigla: '',
      nombre: '',
      conPlantilla: '',
      esPublico: '',
      estaActivo: ''
    });
  }
}
