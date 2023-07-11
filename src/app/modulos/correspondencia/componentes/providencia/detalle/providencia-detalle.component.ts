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

import { Providencia } from '../../../modelos';
import { ProvidenciaFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-providencia-detalle',
  templateUrl: './providencia-detalle.component.html',
  styles: []
})
export class ProvidenciaDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  providencia: Providencia;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private providenciaFacade: ProvidenciaFacade
  ) {
    if (!this.providencia) {
      this.providencia = new Providencia();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.providenciaFacade.CorrespondenciaState$.subscribe(({ providencia }) => {
        if (providencia) {
          this.providencia = providencia;
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
          providenciaId: this.providencia.id
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
