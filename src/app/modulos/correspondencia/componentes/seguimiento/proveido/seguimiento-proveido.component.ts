import {
  Component,
  HostListener,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Proveido, Seguimiento } from '../../../modelos';
import { SeguimientoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-seguimiento-proveido',
  templateUrl: './seguimiento-proveido.component.html',
  styles: []
})
export class SeguimientoProveidoComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  seguimiento: Seguimiento;
  proveidoFirmado: Proveido;
  signatarios: any[];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private seguimientoFacade: SeguimientoFacade
  ) {
    if (!this.seguimiento) {
      this.seguimiento = new Seguimiento();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguimientoFacade.CorrespondenciaState$.subscribe(
      )
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
