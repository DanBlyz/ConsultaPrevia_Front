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

import { Tramite } from '../../../modelos';
import { TramiteFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-tramite-detalle',
  templateUrl: './tramite-detalle.component.html',
  styles: []
})
export class TramiteDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  tramite: Tramite;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private tramiteFacade: TramiteFacade
  ) {
    if (!this.tramite) {
      this.tramite = new Tramite();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.tramiteFacade.CorrespondenciaState$.subscribe(({ tramite }) => {
        if (tramite) {
          this.tramite = tramite;
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
          tramiteId: this.tramite.id
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
