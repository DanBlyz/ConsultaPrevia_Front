import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-firma-digital',
  templateUrl: './firma-digital.component.html',
  styles: []
})
export class FirmaDigitalComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalFirmaDigital') modalFirmaDigital: NgbModal;
  modal: NgbModalRef;

  ubicacion = Ubicacion.Cuerpo;
  uid = null;
  posicion: number;
  datos: any = {
    signatarios: [{ nombre: '', puesto: '' }]
  };
  datosPresentacion: any = {
    signatarios: [
      { nombre: 'Nombre del remitente', puesto: 'Puesto del remitente' }
    ]
  };

  parametros: any;

  constructor(private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    if (
      Object.keys(parametros).length !== 0 &&
      (parametros.vias || parametros.remitentes)
    ) {
      this.datos = {
        signatarios: [...parametros.vias, ...parametros.remitentes]
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: FirmaDigitalComponent.name,
      plantilla: 'firma-digital',
      uid: this.uid,
      ubicacion: this.ubicacion,
      posicion: this.posicion,
      datos:
        this.modoVisualizacion === ModoVisualizacion.Esquema
          ? null
          : { ...this.datos }
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
    this.modal = this.modalService.open(this.modalFirmaDigital, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
