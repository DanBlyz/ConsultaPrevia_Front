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

import { Reunion } from '../../../modelos';
import { ReunionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-reunion-detalle',
  templateUrl: './reunion-detalle.component.html',
  styles: []
})
export class ReunionDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  reunion: Reunion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private reunionFacade: ReunionFacade
  ) {
    if (!this.reunion) {
      this.reunion = new Reunion();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.reunionFacade.CorrespondenciaState$.subscribe(({ reunion }) => {
        if (reunion) {
          this.reunion = reunion;
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
          reunionId: this.reunion.id
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
