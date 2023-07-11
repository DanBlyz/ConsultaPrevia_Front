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

import { Grupo } from '../../../modelos';
import { GrupoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-detalle',
  templateUrl: './grupo-detalle.component.html',
  styles: []
})
export class GrupoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  grupo: Grupo;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private grupoFacade: GrupoFacade
  ) {
    if (!this.grupo) {
      this.grupo = new Grupo();
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
          grupoId: this.grupo.id
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
