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

import { Viaje } from '../../../modelos';
import { ViajeFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-viaje-detalle',
  templateUrl: './viaje-detalle.component.html',
  styles: []
})
export class ViajeDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  viaje: Viaje;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private viajeFacade: ViajeFacade
  ) {
    if (!this.viaje) {
      this.viaje = new Viaje();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.viajeFacade.CorrespondenciaState$.subscribe(({ viaje }) => {
        if (viaje) {
          this.viaje = viaje;
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
          viajeId: this.viaje.id
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
