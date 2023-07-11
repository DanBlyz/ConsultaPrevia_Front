import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RawEditorSettings } from 'tinymce';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';

import { ModoVisualizacion, Ubicacion } from '../../../enumeraciones';
import { Bloque, BloqueComponente } from '../../../interfaces';

@Component({
  selector: 'app-plantilla-contenido',
  templateUrl: './contenido.component.html',
  styles: []
})
export class ContenidoComponent implements BloqueComponente, OnInit {
  @Input() modoVisualizacion = ModoVisualizacion.Presentacion;
  @Output() operacion = new EventEmitter<any>();
  @Output() accion = new EventEmitter<any>();

  @ViewChild('modalContenido') modalContenido: NgbModal;
  modal: NgbModalRef;

  tinymceInit: RawEditorSettings = {
    height: 500,
    menubar: false,
    inline: true,
    placeholder: 'Ingrese el contenido aquí',
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
  datos: any = {
    html: ''
  };
  datosPresentacion: any = {
    html: `
      <p style="text-align: justify;" data-mce-style="text-align: justify;">
      [PÁRRAFO]
      </p>
      <p style="text-align: justify;" data-mce-style="text-align: justify;">
      [PÁRRAFO]
      </p>`
  };

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal) {
    this.uid = this.uid || uuid.v4();
    this.ubicacion = this.ubicacion || Ubicacion.Cuerpo;
  }

  ngOnInit(): void {
    //
  }

  establecerParametros() {
    //
  }

  obtenerBloque(): Bloque {
    return {
      componente: ContenidoComponent.name,
      plantilla: 'contenido',
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
    this.modal = this.modalService.open(this.modalContenido, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
