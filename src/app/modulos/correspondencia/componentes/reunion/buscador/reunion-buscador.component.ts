import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { ReunionFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-reunion-buscador',
  templateUrl: './reunion-buscador.component.html',
  styles: []
})
export class ReunionBuscadorComponent implements OnInit {
  @Output() accion = new EventEmitter<any>();
  @Input() objeto: ReunionFilter;

  formBuscador: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formBuscador = this.fb.group({
      notificacion: [''],
      nroReunion: [''],
      conAcuerdo: [''],
      motivo: [''],
      reunionRealizada: ['']
    });
  }

  ngOnInit(): void {
    this.formBuscador.setValue({
      notificacion: this.objeto?.notificacion?.tramite?.correlativo || '',
      nroReunion: this.objeto?.nroReunion || '',
      conAcuerdo: this.objeto?.conAcuerdo || '',
      motivo: this.objeto?.motivo || '',
      reunionRealizada: this.objeto?.reunionRealizada || ''
    });
  }

  ejecutarAccion(): void {
    const objeto = { ...this.formBuscador.value } as ReunionFilter;
    const correlativoBuscador = objeto.notificacion+"";
    objeto.notificacion = { tramite : {
                            correlativo: correlativoBuscador
    }
  };
   console.log(objeto);
    this.accion.emit({
      accion: 'buscar',
      reunion: FuncionesHelper.quitarNulos(objeto)
    });
  }

  limpiar(): void {
    this.formBuscador.reset({
      notificacion: '',
      nroReunion: '',
      conAcuerdo: '',
      motivo: '',
      reunionRealizada: ''
    });
  }
}
