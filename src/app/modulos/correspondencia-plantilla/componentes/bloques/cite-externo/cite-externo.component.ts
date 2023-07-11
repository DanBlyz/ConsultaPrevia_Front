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
  selector: 'app-plantilla-cite-externo',
  templateUrl: './cite-externo.component.html',
  styles: []
})
export class CiteExternoComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalCiteExterno') modalCiteExterno: NgbModal;
  modal: NgbModalRef;

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {
    citeExterno: '',
    lugar: '',
    instante: ''
  };
  datosPresentacion: any = {
    citeExterno: 'GM-DGAA-UAD-1/2023',
    lugar: 'La Paz',
    instante: '2023-01-03 08:30:00'
  };
  configuracion: any = {
    formatoFecha: 'dd/MM/yyyy',
    formatoHora: 'HH:mm'
  };
  formConfiguracion: FormGroup;

  parametros: any;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      formatoFecha: [this.configuracion.formatoFecha, Validators.required],
      formatoHora: [this.configuracion.formatoHora, Validators.required]
    });
  }

  ngOnInit(): void {
    this.establecerParametros(this.parametros);
  }

  establecerParametros(parametros: any) {
    this.configuracion = { ...this.formConfiguracion.getRawValue() };
    if (Object.keys(parametros).length !== 0 && parametros.citeExterno) {
      this.datos = {
        ...this.datos,
        citeExterno: parametros.citeExterno
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.lugar) {
      this.datos = {
        ...this.datos,
        lugar: parametros.lugar
      };
    }
    if (Object.keys(parametros).length !== 0 && parametros.instante) {
      this.datos = {
        ...this.datos,
        instante: parametros.instante
      };
    }
  }

  obtenerBloque(): Bloque {
    return {
      componente: CiteExternoComponent.name,
      plantilla: 'cite-externo',
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
    this.modal = this.modalService.open(this.modalCiteExterno, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
