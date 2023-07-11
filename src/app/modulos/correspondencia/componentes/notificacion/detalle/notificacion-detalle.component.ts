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

import { Notificacion } from '../../../modelos';
import { NotificacionFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-notificacion-detalle',
  templateUrl: './notificacion-detalle.component.html',
  styles: []
})
export class NotificacionDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  notificacion: Notificacion;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private notificacionFacade: NotificacionFacade
  ) {
    if (!this.notificacion) {
      this.notificacion = new Notificacion();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.notificacionFacade.CorrespondenciaState$.subscribe(({ notificacion }) => {
        if (notificacion) {
          this.notificacion = notificacion;
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
          notificacionId: this.notificacion.id
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
