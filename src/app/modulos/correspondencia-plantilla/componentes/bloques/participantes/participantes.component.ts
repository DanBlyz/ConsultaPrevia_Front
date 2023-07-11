import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-participantes',
  templateUrl: './participantes.component.html',
  styles: []
})
export class ParticipantesComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalParticipante') modalParticipante: NgbModal;
  modal: NgbModalRef;

  ubicacion = Ubicacion.Cuerpo;
  uid = null;
  posicion: number;
  datos: any = {
    destinatarios: [
      {
        nombre: '',
        uniOrganizacional: '',
        puesto: ''
      }
    ],
    vias: [
      {
        nombre: '',
        uniOrganizacional: '',
        puesto: ''
      }
    ],
    remitentes: [
      {
        nombre: '',
        uniOrganizacional: '',
        puesto: ''
      }
    ]
  };
  datosPresentacion: any = {
    destinatarios: [
      {
        nombre: 'Nombre del destinatario',
        uniOrganizacional: 'Unidad organizacional del destinatario',
        puesto: 'Puesto del destinatario'
      }
    ],
    vias: [
      {
        nombre: '',
        uniOrganizacional: '',
        puesto: ''
      }
    ],
    remitentes: [
      {
        nombre: 'Nombre del remitente',
        uniOrganizacional: 'Unidad organizacional del remitente',
        puesto: 'Puesto del remitente'
      }
    ]
  };
  configuracion: any = {
    usarVia: true,
    etiquetaDestinatario: 'A:',
    etiquetaVia: 'VIA:',
    etiquetaRemitente: 'DE:'
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      usarVia: [true, Validators.required],
      etiquetaDestinatario: [
        this.configuracion.etiquetaDestinatario,
        Validators.required
      ],
      etiquetaVia: [this.configuracion.etiquetaVia, Validators.required],
      etiquetaRemitente: [
        this.configuracion.etiquetaRemitente,
        Validators.required
      ]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.destinatarios) {
      this.datos = {
        ...this.datos,
        destinatarios: [...parametros.destinatarios]
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.vias) {
      this.datos = {
        ...this.datos,
        vias: [...parametros.vias]
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.remitentes) {
      this.datos = {
        ...this.datos,
        remitentes: [...parametros.remitentes]
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: ParticipantesComponent.name,
      plantilla: 'participantes',
      uid: this.uid,
      ubicacion: this.ubicacion,
      posicion: this.posicion,
      datos:
        this.modoVisualizacion === ModoVisualizacion.Esquema
          ? null
          : { ...this.datos },
      configuracion: { ...this.configuracion }
    };
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'configurar-bloque': {
        this.mostrarModal();
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'aplicar-configuracion': {
        this.configuracion = { ...this.formConfiguracion.getRawValue() };
        this.accion.emit({
          accion: evento.accion,
          uid: this.uid
        });
        this.cerrarModal();
        break;
      }
      default: {
        this.accion.emit({
          accion: evento.accion,
          uid: this.uid
        });
        break;
      }
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalParticipante, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
