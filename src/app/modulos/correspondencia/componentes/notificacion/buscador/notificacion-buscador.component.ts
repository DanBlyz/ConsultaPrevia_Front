import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { NotificacionFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-notificacion-buscador',
  templateUrl: './notificacion-buscador.component.html',
  styles: []
})
export class NotificacionBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: NotificacionFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      notificado: [''],
      direccionDpto: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      notificado: this.objeto?.notificado || '',
      direccionDpto: this.objeto?.direccionDpto || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as NotificacionFilter;
    this.accion.emit({
      accion: 'buscar',
      notificacion: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      notificado: '',
      direccionDpto: ''
    });
  }
}
