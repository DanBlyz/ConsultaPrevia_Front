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

import { PagoCpt } from '../../../modelos';
import { PagoCptFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-pago-cpt-detalle',
  templateUrl: './pago-cpt-detalle.component.html',
  styles: []
})
export class PagoCptDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  pagoCpt: PagoCpt;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private pagoCptFacade: PagoCptFacade
  ) {
    if (!this.pagoCpt) {
      this.pagoCpt = new PagoCpt();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.pagoCptFacade.CorrespondenciaState$.subscribe(({ pagoCpt }) => {
        if (pagoCpt) {
          this.pagoCpt = pagoCpt;
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
          pagoCptId: this.pagoCpt.id
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
