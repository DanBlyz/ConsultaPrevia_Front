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
  selector: 'app-plantilla-referencia',
  templateUrl: './referencia.component.html',
  styles: []
})
export class ReferenciaComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalReferencia') modalReferencia: NgbModal;
  modal: NgbModalRef;

  ubicacion = Ubicacion.Cuerpo;
  uid = null;
  posicion: number;
  datos: any = {
    texto: ''
  };
  datosPresentacion: any = {
    texto: 'Sistema de Gestión Documental Digital'
  };
  configuracion: any = {
    esParaEncabezado: true,
    etiquetaReferencia: 'REF.:',
    alineacion: 'IZQUIERDA',
    margenIzquierdo: '0'
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      esParaEncabezado: [
        this.configuracion.esParaEncabezado,
        Validators.required
      ],
      etiquetaReferencia: [
        this.configuracion.etiquetaReferencia,
        Validators.required
      ],
      alineacion: [this.configuracion.alineacion, Validators.required],
      margenIzquierdo: [this.configuracion.margenIzquierdo, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }
  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.referencia) {
      this.datos = {
        ...this.datos,
        texto: parametros.referencia
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: ReferenciaComponent.name,
      plantilla: 'referencia',
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
    this.modal = this.modalService.open(this.modalReferencia, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
