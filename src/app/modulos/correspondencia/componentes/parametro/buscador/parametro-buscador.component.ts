import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuncionesHelper } from '../../../../../comun/auxiliares';
import { ParametroFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-parametro-buscador',
  templateUrl: './parametro-buscador.component.html',
  styles: []
})
export class ParametroBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ParametroFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      tipo: [''],
      texto: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      tipo: this.objeto?.tipo || '',
      texto: this.objeto?.texto || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ParametroFilter;
    this.accion.emit({
      accion: 'buscar',
      parametro: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      tipo: '',
      texto: ''
    });
  }
}
