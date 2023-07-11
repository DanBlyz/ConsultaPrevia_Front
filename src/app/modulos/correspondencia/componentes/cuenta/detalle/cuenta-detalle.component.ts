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

import { Cuenta } from '../../../modelos';
import { CuentaFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-cuenta-detalle',
  templateUrl: './cuenta-detalle.component.html',
  styles: []
})
export class CuentaDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  cuenta: Cuenta;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private cuentaFacade: CuentaFacade
  ) {
    if (!this.cuenta) {
      this.cuenta = new Cuenta();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.cuentaFacade.CorrespondenciaState$.subscribe(({ cuenta }) => {
        if (cuenta) {
          this.cuenta = cuenta;
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
          cuentaId: this.cuenta.id
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
