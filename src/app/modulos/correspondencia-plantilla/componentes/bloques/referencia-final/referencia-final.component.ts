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
  selector: 'app-plantilla-referencia-final',
  templateUrl: './referencia-final.component.html',
  styles: []
})
export class ReferenciaFinalComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalReferenciaFinal') modalReferenciaFinal: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {
    // copia: '',
    iniciales: '',
    hojaRuta: ''
  };
  datosPresentacion: any = {
    // copia: 'CC Archivo',
    iniciales: 'INICIALES',
    hojaRuta: 'HOJA DE RUTA'
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
    // if (Object.keys(parametros).length !== 0 && parametros.copia) {
    //   this.datos = {
    //     ...this.datos,
    //     copia: parametros.copia
    //   };
    // }
    if (Object.keys(parametros).length !== 0 && parametros.iniciales) {
      this.datos = {
        ...this.datos,
        iniciales: parametros.iniciales
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.hojaRuta) {
      this.datos = {
        ...this.datos,
        hojaRuta: parametros.hojaRuta
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: ReferenciaFinalComponent.name,
      plantilla: 'referencia-final',
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
    this.modal = this.modalService.open(this.modalReferenciaFinal, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
