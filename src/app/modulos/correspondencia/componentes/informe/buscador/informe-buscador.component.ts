import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { InformeFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-informe-buscador',
  templateUrl: './informe-buscador.component.html',
  styles: []
})
export class InformeBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: InformeFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      tramite:[''],
      correlativo: [''],
      referencia: [''],
      tipoDocumento: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      tramite: this.objeto?.tramite?.correlativo || '',
      correlativo: this.objeto?.correlativo || '',
      referencia: this.objeto?.referencia || '',
      tipoDocumento: this.objeto?.tipoDocumento || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as InformeFilter;
    const correlativoBuscador = objeto.tramite+"";
    objeto.tramite = { correlativo : correlativoBuscador};
    console.log(objeto+"entro aqui buscar");
    this.accion.emit({
      accion: 'buscar',
      informe: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      tramite: '',
      correlativo: '',
      referencia: '',
      tipoDocumento: ''
    });
  }
}
