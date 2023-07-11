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
  selector: 'app-plantilla-encabezado',
  templateUrl: './encabezado.component.html',
  styles: []
})
export class EncabezadoComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalEncabezado') modalEncabezado: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {
    tipoDocumento: '',
    cite: '',
    hojaRuta: ''
  };
  datosPresentacion: any = {
    tipoDocumento: 'TIPO DE DOCUMENTO',
    cite: 'CITE',
    hojaRuta: 'HOJA DE RUTA'
  };
  configuracion: any = {
    imprimirTipoDocumento: true,
    alineacion: 'CENTRO' // [ IZQUIERDA, CENTRO, DERECHA ]
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      imprimirTipoDocumento: [
        this.configuracion.imprimirTipoDocumento,
        Validators.required
      ],
      alineacion: [this.configuracion.alineacion, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.tipoDocumento) {
      this.datos = {
        ...this.datos,
        tipoDocumento: parametros.tipoDocumento
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.cite) {
      this.datos = {
        ...this.datos,
        cite: parametros.cite
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
      componente: EncabezadoComponent.name,
      plantilla: 'encabezado',
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
    this.modal = this.modalService.open(this.modalEncabezado, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
