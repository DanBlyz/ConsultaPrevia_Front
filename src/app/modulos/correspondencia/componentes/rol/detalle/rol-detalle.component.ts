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

import { Rol } from '../../../modelos';
import { RolFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-rol-detalle',
  templateUrl: './rol-detalle.component.html',
  styles: []
})
export class RolDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  rol: Rol;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private rolFacade: RolFacade
  ) {
    if (!this.rol) {
      this.rol = new Rol();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.rolFacade.CorrespondenciaState$.subscribe(({ rol }) => {
        if (rol) {
          this.rol = rol;
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
          rolId: this.rol.id
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
