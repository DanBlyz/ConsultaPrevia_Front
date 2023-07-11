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
  selector: 'app-plantilla-pie',
  templateUrl: './pie.component.html',
  styles: []
})
export class PieComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalPie') modalPie: NgbModal;
  modal: NgbModalRef;

  ubicacion = Ubicacion.Pie;
  uid = null;
  posicion: number;
  datos: any = {
    mensaje: ''
  };
  datosPresentacion: any = {};
  configuracion: any = {
    mensaje: 'Aruskipasipxañanakasakipunirakispawa',
    alineacion: 'CENTRO' // [ IZQUIERDA, CENTRO, DERECHA ]
  };
  formConfiguracion: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Pie;
    this.formConfiguracion = this.fb.group({
      mensaje: [this.configuracion.mensaje],
      alineacion: [this.configuracion.alineacion, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros();
  }

  establecerParametros() {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
  }

  obtenerBloque(): Bloque {
    return {
      componente: PieComponent.name,
      plantilla: 'pie',
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
    this.modal = this.modalService.open(this.modalPie, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
