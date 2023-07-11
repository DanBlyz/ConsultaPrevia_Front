import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-membrete',
  templateUrl: './membrete.component.html',
  styles: []
})
export class MembreteComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalMembrete') modalMembrete: NgbModal;
  modal: NgbModalRef;

  ubicacion: Ubicacion.Encabezado;
  uid = null;
  posicion: number;
  datos: any = {};
  datosPresentacion: any = {};
  configuracion: any = {
    imagen: 'https://adsib.gob.bo/portal_frontend/assets/img/logo-adsib.png',
    imprimirImagen: true,
    alineacion: 'CENTRO' // [ IZQUIERDA, CENTRO, DERECHA ]
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Encabezado;
    this.formConfiguracion = this.fb.group({
      imagen: [this.configuracion.imagen, Validators.required],
      imprimirImagen: [this.configuracion.imprimirImagen, Validators.required],
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
      componente: MembreteComponent.name,
      plantilla: 'membrete',
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
    this.modal = this.modalService.open(this.modalMembrete, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
