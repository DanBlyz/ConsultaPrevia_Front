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

import { Clasificacion } from '../../../modelos';
import { ClasificacionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-clasificacion-detalle',
  templateUrl: './clasificacion-detalle.component.html',
  styles: []
})
export class ClasificacionDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  clasificacion: Clasificacion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private clasificacionFacade: ClasificacionFacade
  ) {
    if (!this.clasificacion) {
      this.clasificacion = new Clasificacion();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.clasificacionFacade.CorrespondenciaState$.subscribe(
        ({ clasificacion }) => {
          if (clasificacion) {
            this.clasificacion = clasificacion;
          }
        }
      )
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
          clasificacionId: this.clasificacion.id
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
