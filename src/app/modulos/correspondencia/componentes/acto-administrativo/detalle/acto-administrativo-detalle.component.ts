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

import { ActoAdministrativo } from '../../../modelos';
import { ActoAdministrativoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-acto-administrativo-detalle',
  templateUrl: './acto-administrativo-detalle.component.html',
  styles: []
})
export class ActoAdministrativoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  actoAdministrativo: ActoAdministrativo;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private actoAdministrativoFacade: ActoAdministrativoFacade
  ) {
    if (!this.actoAdministrativo) {
      this.actoAdministrativo = new ActoAdministrativo();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.actoAdministrativoFacade.CorrespondenciaState$.subscribe(({ actoAdministrativo }) => {
        if (actoAdministrativo) {
          this.actoAdministrativo = actoAdministrativo;
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
          actoAdministrativoId: this.actoAdministrativo.id
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
