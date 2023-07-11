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
import { DomSanitizer } from '@angular/platform-browser';
import { RawEditorSettings } from 'tinymce';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-texto',
  templateUrl: './texto.component.html',
  styles: []
})
export class TextoComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalTexto') modalTitulo: NgbModal;
  modal: NgbModalRef;

  tinymceInit: RawEditorSettings = {
    height: 500,
    menubar: false,
    inline: false,
    placeholder: 'Ingrese el texto aquí',
    plugins: [
      'autoresize',
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'code',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'help',
      'wordcount'
    ],
    toolbar: [
      'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat | help'
    ],
    contextmenu: false,
    browser_spellcheck: true,
    language_url: 'assets/js/tinymce/langs/es_419.js',
    language: 'es_419'
  };

  uid = null;
  ubicacion = Ubicacion.Cuerpo;
  posicion: number;
  datos: any = {};
  datosPresentacion: any = {};
  configuracion: any = {
    html: 'Texto'
  };
  formConfiguracion: FormGroup;

  constructor(
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
    this.formConfiguracion = this.fb.group({
      html: [this.configuracion.html, Validators.required]
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
      componente: TextoComponent.name,
      plantilla: 'texto',
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
