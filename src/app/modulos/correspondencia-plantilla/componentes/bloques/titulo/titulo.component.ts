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
  selector: 'app-plantilla-titulo',
  templateUrl: './titulo.component.html',
  styles: []
})
export class TituloComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalTitulo') modalTitulo: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {};
  datosPresentacion: any = {};
  configuracion: any = {
    texto: 'TÍTULO',
    nivel: 'NIVEL 1', // [ NIVEL 1, NIVEL 2, NIVEL 3 ],
    alineacion: 'IZQUIERDA' // [ IZQUIERDA, CENTRO, DERECHA ],
  };
  formConfiguracion: FormGroup;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      texto: [this.configuracion.texto, Validators.required],
      nivel: [this.configuracion.nivel, Validators.required],
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
      componente: TituloComponent.name,
      plantilla: 'titulo',
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
    this.modal = this.modalService.open(this.modalTitulo, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
