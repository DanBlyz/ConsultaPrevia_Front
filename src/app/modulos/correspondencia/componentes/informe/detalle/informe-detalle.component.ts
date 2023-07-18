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

import { Informe } from '../../../modelos';
import { InformeFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-informe-detalle',
  templateUrl: './informe-detalle.component.html',
  styles: []
})
export class InformeDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  informe: Informe;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private informeFacade: InformeFacade
  ) {
    if (!this.informe) {
      this.informe = new Informe();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.informeFacade.CorrespondenciaState$.subscribe(({ informe }) => {
        if (informe) {
          this.informe = informe;
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
          informeId: this.informe.id
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
