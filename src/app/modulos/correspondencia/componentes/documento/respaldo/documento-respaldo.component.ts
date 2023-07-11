import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { Adjunto, Documento } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-documento-respaldo',
  templateUrl: './documento-respaldo.component.html',
  styles: []
})
export class DocumentoRespaldoComponent implements OnInit, OnDestroy {
  @Input() sePuedeAgregar = false;
  @Output() accion = new EventEmitter<any>();
  suscripcion = new Subscription();

  documento: Documento;
  lista: Adjunto[] = [];

  formatosPermitidos = ['pdf'];
  tamanioMaximo = 50;

  constructor(
    private documentoFacade: DocumentoFacade,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          if (this.documento !== documento) {
            this.documento = documento;
            this.lista = documento.listaAdjunto.filter(
              (item) => item.tipo === 'RESPALDO'
            );
          }
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'adjunto-seleccionado': {
        const reader = new FileReader();
        if (evento.input.target.files && evento.input.target.files.length) {
          const [file] = evento.input.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            const archivo = reader.result.toString().split(',')[1];
            const tipoMime = file.type;
            const extension = file.name
              .substring(file.name.lastIndexOf('.') + 1, file.name.length)
              .toLowerCase();
            const tamanio = file.size;

            if (!this.formatosPermitidos.includes(extension)) {
              this.toastrService.error(
                'Formato de archivo no soportado.',
                'Selección de archivo'
              );
              return;
            }

            if (tamanio > this.tamanioMaximo * 1024 * 1000) {
              this.toastrService.error(
                `El tamaño del archivo seleccionado excede el límite permitido.`,
                'Selección de archivo'
              );
              return;
            }

            Swal.fire({
              title: '¿Está seguro que desea agregar el documento?',
              text: file.name,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, agregar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.ejecutarAccion({
                  accion: 'agregar-adjunto',
                  nombre: file.name,
                  tipoMime: tipoMime,
                  extension: extension,
                  archivoBase64: archivo
                });
              }
            });
          };
        }

        break;
      }
    }
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'agregar-adjunto': {
        const adjunto = new Adjunto();
        adjunto.tipo = 'RESPALDO';
        adjunto.tipoMime = evento.tipoMime;
        adjunto.extension = evento.extension;
        adjunto.estaFirmado = false;
        adjunto.nomPublico = evento.nombre;
        adjunto.archivoBase64 = evento.archivoBase64;

        this.documentoFacade
          .guardarAdjunto(this.documento.id, adjunto)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.accion.emit({
                accion: 'adjunto-agregado'
              });
            }
          });
        break;
      }
      case 'quitar-adjunto': {
        Swal.fire({
          title: '¿Está seguro que desea eliminer el documento anexo?',
          text: 'Esta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade
              .eliminarAdjunto(this.documento.id, evento.id)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.accion.emit({
                    accion: 'adjunto-eliminado'
                  });
                }
              });
          }
        });
        break;
      }
      case 'descargar-adjunto': {
        const respuesta =
          await this.documentoFacade.obtenerAdjuntoPorDocumentoId(
            this.documento.id,
            evento.id
          );
        if (respuesta.tipoRespuesta === 'Exito') {
          FuncionesHelper.descargarArchivoBase64(
            respuesta.objeto.archivoBase64,
            `${respuesta.objeto.nomPublico.replace('/', '-')}`,
            'pdf'
          );
        }
        break;
      }
      case 'cancelar': {
        break;
      }
    }
  }
}
