import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-adjuntos',
  templateUrl: './adjuntos.component.html',
  styles: []
})
export class AdjuntosComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalAdjuntos') modalAdjuntos: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {
    adjuntos: []
  };
  datosPresentacion: any = {
    adjuntos: [
      {
        nombre: 'adjunto.pdf',
        enlace: '#'
      }
    ]
  };

  parametros: any;

  constructor(
    public sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    if (Object.keys(parametros).length !== 0 && parametros.adjuntos) {
      this.datos = {
        adjuntos: parametros.adjuntos
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: AdjuntosComponent.name,
      plantilla: 'adjuntos',
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
    this.modal = this.modalService.open(this.modalAdjuntos, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
