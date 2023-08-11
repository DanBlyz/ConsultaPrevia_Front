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
      tramite: [''],
      notificado: [''],
      direccionDpto: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      tramite: this.objeto?.tramite?.correlativo || '',
      notificado: this.objeto?.notificado || '',
      direccionDpto: this.objeto?.direccionDpto || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as NotificacionFilter;
    const correlativoBuscador = objeto.tramite+"";
    objeto.tramite = { correlativo : correlativoBuscador};
    this.accion.emit({
      accion: 'buscar',
      notificacion: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      tramite: '',
      notificado: '',
      direccionDpto: ''
    });
  }
}
