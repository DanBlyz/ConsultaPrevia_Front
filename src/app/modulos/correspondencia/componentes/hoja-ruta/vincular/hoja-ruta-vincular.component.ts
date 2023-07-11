import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Documento, DocumentoHojaRuta } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-hoja-ruta-vincular',
  templateUrl: './hoja-ruta-vincular.component.html',
  styles: []
})
export class HojaRutaVincularComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  documento: Documento;
  //lista: Seguimiento[];
  documentoHojaRuta: DocumentoHojaRuta;

  lista: DocumentoHojaRuta[];

  constructor(private documentoFacade: DocumentoFacade) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          if (this.documento !== documento) {
            this.documento = documento;
            this.documentoFacade
              .obtenerDocumentoHojaRutaPorDocumentoId(this.documento.id)
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
}
