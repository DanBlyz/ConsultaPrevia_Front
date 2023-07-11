import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Documento, HojaRuta } from '../../../modelos';
import { HojaRutaFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-hoja-ruta-detalle',
  templateUrl: './hoja-ruta-detalle.component.html',
  styles: []
})
export class HojaRutaDetalleComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  documento: Documento;
  hojaRuta: HojaRuta;

  constructor(private hojaRutaFacade: HojaRutaFacade) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.hojaRutaFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          if (this.documento !== documento) {
            this.documento = documento;
            if (this.documento.hojaRutaId === null) {
              this.documento.hojaRutaId = 0;
            }
            this.hojaRutaFacade
              .obtenerPorId(this.documento.hojaRutaId)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.hojaRuta = respuesta.objeto;
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

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'buscar': {
        this.hojaRutaFacade.establecerFiltro(evento.hojaRuta);
        break;
      }
      case 'cancelar': {
        break;
      }
    }
  }
}
