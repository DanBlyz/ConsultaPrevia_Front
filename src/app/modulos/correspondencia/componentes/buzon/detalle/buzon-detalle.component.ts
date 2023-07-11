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

import { Buzon } from '../../../modelos';
import { BuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-detalle',
  templateUrl: './buzon-detalle.component.html',
  styles: []
})
export class BuzonDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  buzon: Buzon;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private buzonFacade: BuzonFacade
  ) {
    if (!this.buzon) {
      this.buzon = new Buzon();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzon }) => {
        if (buzon) {
          this.buzon = buzon;
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
          buzonId: this.buzon.id
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
