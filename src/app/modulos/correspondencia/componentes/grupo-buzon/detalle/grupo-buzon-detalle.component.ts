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

import { Grupo, GrupoBuzon } from '../../../modelos';
import { GrupoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-buzon-detalle',
  templateUrl: './grupo-buzon-detalle.component.html',
  styles: []
})
export class GrupoBuzonDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  grupo: Grupo;
  grupoBuzon: GrupoBuzon;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private grupoFacade: GrupoFacade
  ) {
    if (!this.grupoBuzon) {
      this.grupoBuzon = new GrupoBuzon();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(({ grupo }) => {
        if (grupo) {
          this.grupo = grupo;
        }
      })
    );

    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(({ grupoBuzon }) => {
        if (grupoBuzon) {
          this.grupoBuzon = grupoBuzon;
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
          grupoId: this.grupo.id,
          grupoBuzonId: this.grupoBuzon.id
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
