import {
  Component,
  HostListener,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Archivado, Seguimiento } from '../../../modelos';
import { SeguimientoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-seguimiento-archivado',
  templateUrl: './seguimiento-archivado.component.html',
  styles: []
})
export class SeguimientoArchivadoComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  seguimiento: Seguimiento;
  archivado: Archivado;
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
        async ({ seguimiento }) => {
          if (seguimiento && this.seguimiento !== seguimiento) {
            this.seguimiento = seguimiento;
          }
        }
      )
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
