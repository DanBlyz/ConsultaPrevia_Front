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
  selector: 'app-plantilla-remitente-externo',
  templateUrl: './remitente-externo.component.html',
  styles: []
})
export class RemitenteExternoComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalRemitenteExterno') modalRemitenteExterno: NgbModal;
  modal: NgbModalRef;

  ubicacion = Ubicacion.Cuerpo;
  uid = null;
  posicion: number;
  datos: any = {
    remitente: {
      entidad: '',
      nombre: '',
      puesto: ''
    }
  };
  datosPresentacion: any = {
    remitente: {
      entidad: 'Entidad del remitente',
      nombre: 'Nombre del remitente',
      puesto: 'Puesto del remitente'
    }
  };
  configuracion: any = {
    etiquetaEntidad: 'ENTIDAD:',
    etiquetaNombre: 'NOMBRE:',
    etiquetaPuesto: 'PUESTO:'
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      etiquetaEntidad: [
        this.configuracion.etiquetaEntidad,
        Validators.required
      ],
      etiquetaNombre: [this.configuracion.etiquetaNombre, Validators.required],
      etiquetaPuesto: [this.configuracion.etiquetaPuesto, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.remitenteExterno) {
      this.datos = {
        ...this.datos,
        remitente: { ...parametros.remitenteExterno }
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: RemitenteExternoComponent.name,
      plantilla: 'remitente-externo',
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
    this.modal = this.modalService.open(this.modalRemitenteExterno, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
