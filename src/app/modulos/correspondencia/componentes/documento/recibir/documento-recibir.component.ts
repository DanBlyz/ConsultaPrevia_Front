import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { DocumentoFacade, SeguimientoFacade } from '../../../fachadas';
import { Adjunto, Documento } from '../../../modelos';

@Component({
  selector: 'app-correspondencia-documento-recibir',
  templateUrl: './documento-recibir.component.html',
  styles: []
})
export class DocumentoRecibirComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  documento: Documento;
  documentoAdjunto: Adjunto;

  constructor(
    private documentoFacade: DocumentoFacade,
    private seguimientoFacade: SeguimientoFacade
  ) {}

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento && this.documento !== documento) {
          this.documento = documento;
          this.documentoAdjunto = this.documento.listaAdjunto.find(
            (item) => item.tipo === 'DOCUMENTO'
          );
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'recibir': {
        Swal.fire({
          title: '¿Está seguro que desea recibir el documento?',
          text: 'Ésta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, recibir',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade.recibir(evento.id).then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                //
              }
            });
          }
        });
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }
}
