import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { UsuarioFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-usuario-buscador',
  templateUrl: './usuario-buscador.component.html',
  styles: []
})
export class UsuarioBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: UsuarioFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      nombre: [''],
      apellido: [''],
      nomPublico: [''],
      correoElectronico: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      nombre: this.objeto?.nombre || '',
      apellido: this.objeto?.apellido || '',
      nomPublico: this.objeto?.nomPublico || '',
      correElectronico: this.objeto?.correoElectronico || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as UsuarioFilter;
    this.accion.emit({
      accion: 'buscar',
      usuario: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      nombre: '',
      apellido: '',
      nomPublico: '',
      correElectronico: ''
    });
  }
}
