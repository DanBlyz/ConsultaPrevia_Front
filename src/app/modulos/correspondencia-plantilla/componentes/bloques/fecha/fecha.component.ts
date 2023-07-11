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
  selector: 'app-plantilla-fecha',
  templateUrl: './fecha.component.html',
  styles: []
})
export class FechaComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalFecha') modalFecha: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {
    lugar: '',
    fecha: ''
  };
  datosPresentacion: any = {
    lugar: 'La Paz',
    fecha: '2023-01-02'
  };
  configuracion: any = {
    imprimirEtiqueta: true,
    formato: "dd 'de' MMMM 'de' yyyy"
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      imprimirEtiqueta: [
        this.configuracion.imprimirEtiqueta,
        Validators.required
      ],
      formato: [this.configuracion.formato, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.lugar) {
      this.datos = {
        ...this.datos,
        lugar: parametros.lugar
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.fecha) {
      this.datos = {
        ...this.datos,
        fecha: parametros.fecha
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: FechaComponent.name,
      plantilla: 'fecha',
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
    this.modal = this.modalService.open(this.modalFecha, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
