import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Documento, Participante, Seguimiento } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-documento-seguimiento',
  templateUrl: './documento-seguimiento.component.html',
  styles: []
})
export class DocumentoSeguimientoComponent implements OnInit, OnDestroy {
  @Input() mostrarCabecera = false;
  suscripcion = new Subscription();

  documento: Documento;
  listaRemitenteExterno: Participante[] = [];
  lista: Seguimiento[];

  constructor(private documentoFacade: DocumentoFacade) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          if (this.documento !== documento) {
            this.documento = documento;
            this.listaRemitenteExterno =
              this.documento.listaParticipante.filter(
                (participante) => participante.tipo === 'REMITENTE-EXTERNO'
              );
            this.documentoFacade
              .obtenerSeguimientoPorDocumentoId(this.documento.id)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.lista = respuesta.lista;
                }
              });
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
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
    }
  }

  traducirAccion(accion: string) {
    switch (accion) {
      case 'REGISTRAR': {
        return 'registró el documento';
      }
      case 'APROBAR': {
        return 'envió el documento';
      }
      case 'DEVOLVER': {
        return 'devolvió el documento';
      }
      case 'DERIVAR': {
        return 'derivó el documento';
      }
      case 'ARCHIVAR': {
        return 'archivó el documento';
      }
      case 'ANULAR': {
        return 'anuló el documento';
      }
      case 'RESPONDER': {
        return 'respondió al documento';
      }
      default: {
        return '';
      }
    }
  }

  traducirEstado(estado: string, mensaje: string) {
    switch (estado) {
      case 'ENVIADO': {
        return 'no ha realizado ninguna acción todavía';
      }
      case 'APROBADO': {
        return 'aprobó el documento';
      }
      case 'DEVUELTO': {
        return 'devolvió el documento';
      }
      case 'RECEPCIONADO': {
        return 'recibió el documento';
      }
      case 'DERIVADO': {
        return 'derivó el documento';
      }
      case 'ARCHIVADO': {
        return 'archivó el documento';
      }
      case 'ANULADO': {
        return mensaje;
      }
      default: {
        return '';
      }
    }
  }
}
