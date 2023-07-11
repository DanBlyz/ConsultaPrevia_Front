import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ContactoFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-contacto-buscador',
  templateUrl: './contacto-buscador.component.html',
  styles: []
})
export class ContactoBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ContactoFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      nombre: [''],
      puesto: [''],
      uniOrganizacional: [''],
      entidad: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      nombre: this.objeto?.nombre || '',
      puesto: this.objeto?.puesto || '',
      uniOrganizacional: this.objeto?.uniOrganizacional || '',
      entidad: this.objeto?.entidad || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ContactoFilter;
    this.accion.emit({
      accion: 'buscar',
      contacto: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      nombre: '',
      puesto: '',
      uniOrganizacional: '',
      entidad: ''
    });
  }
}
