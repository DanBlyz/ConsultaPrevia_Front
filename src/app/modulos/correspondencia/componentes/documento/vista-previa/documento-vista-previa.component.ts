import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { DocumentoFacade, TipoDocumentoFacade } from '../../../fachadas';
import { Adjunto, Documento, TipoDocumento } from '../../../modelos';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-correspondencia-documento-vista-previa',
  templateUrl: './documento-vista-previa.component.html',
  styles: []
})
export class DocumentoVistaPreviaComponent implements OnInit, OnDestroy {
  @Input() estado: string = null;
  suscripcion = new Subscription();

  tipoDocumento: TipoDocumento;
  documento: Documento;
  documentoAdjunto: Adjunto = null;
  documentoAdjuntoBase64: string = null;
  documentoNombre: string;

  constructor(
    public sanitizer: DomSanitizer,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private documentoFacade: DocumentoFacade,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        async ({ documento }) => {
          if (documento && this.documento !== documento) {
            this.documento = documento;

            const respuesta = await this.tipoDocumentoFacade.obtenerPorId(
              this.documento.tipoDocumentoId
            );
            if (respuesta.tipoRespuesta === 'Exito') {
              this.tipoDocumento = respuesta.objeto;
            }

            this.documentoNombre = `${this.documento.cite.replace(
              '/',
              '-'
            )}.pdf`;
            this.documentoAdjunto = this.documento.listaAdjunto.find(
              (item) => item.tipo === 'DOCUMENTO'
            );
            if (this.documentoAdjunto) {
              this.documentoFacade
                .obtenerAdjuntoPorDocumentoId(
                  this.documento.id,
                  this.documentoAdjunto.id
                )
                .then((respuesta) => {
                  if (
                    respuesta.tipoRespuesta === 'Exito' &&
                    respuesta.objeto.archivoBase64
                  ) {
                    this.documentoAdjuntoBase64 = `${respuesta.objeto.archivoBase64}`;
                  }
                });
            }
          }
        }
      )
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'descargar': {
        const respuesta =
          await this.documentoFacade.obtenerPdfBase64PorDocumentoId(evento.id);
        if (respuesta.tipoRespuesta === 'Exito') {
          FuncionesHelper.descargarArchivoBase64(
            respuesta.objeto.archivoBase64,
            `${this.documento.cite.replace('/', '-')}`,
            'pdf'
          );
        } else {
          this.toastrService.error(
            respuesta.mensaje,
            'Errro al descargar documento'
          );
        }
        break;
      }
      case 'duplicar': {
        Swal.fire({
          title: '¿Está seguro que desea duplicar el documento adjunto?',
          text: 'Ésta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, duplicar documento',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade.duplicar(evento.id).then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.documentoFacade.obtenerContenidoPorDocumentoId(evento.id);
                this.router.navigate([
                  '/',
                  'correspondencia',
                  'bandeja-borradores'
                ]);
              }
            });
          }
        });
        break;
      }
    }
  }
}
