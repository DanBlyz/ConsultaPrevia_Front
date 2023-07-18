import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Resolucion } from '../../../modelos';
import { ResolucionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-resolucion-detalle',
  templateUrl: './resolucion-detalle.component.html',
  styles: []
})
export class ResolucionDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  resolucion: Resolucion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private resolucionFacade: ResolucionFacade
  ) {
    if (!this.resolucion) {
      this.resolucion = new Resolucion();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.resolucionFacade.CorrespondenciaState$.subscribe(({ resolucion }) => {
        if (resolucion) {
          this.resolucion = resolucion;
        }
      })
    );
    switch (this.tipoOperacion) {
      case 'detalle':
        this.botonOperacion = null;
        break;
      case 'eliminar':
        this.botonOperacion = 'Eliminar';
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarAccion(accion: string): void {
    switch (accion) {
      case 'eliminar': {
        this.accion.emit({
          accion,
          resolucionId: this.resolucion.id
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion
        });
        break;
      }
    }
  }
}
