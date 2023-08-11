import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ResolucionFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-resolucion-buscador',
  templateUrl: './resolucion-buscador.component.html',
  styles: []
})
export class ResolucionBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ResolucionFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      tramite: [''],
      informe: [''],
      correlativo: [''],
      referencia: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      tramite: this.objeto?.tramite?.correlativo || '',
      informe: this.objeto?.informe || '',
      correlativo: this.objeto?.correlativo || '',
      referencia: this.objeto?.referencia || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ResolucionFilter;
    const correlativoBuscador = objeto.tramite+"";
    objeto.tramite = { correlativo : correlativoBuscador};
    this.accion.emit({
      accion: 'buscar',
      resolucion: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      informe: '',
      correlativo: '',
      referencia: ''
    });
  }
}
