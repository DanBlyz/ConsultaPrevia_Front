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

import { Buzon, BuzonUsuario } from '../../../modelos';
import { BuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-usuario-detalle',
  templateUrl: './buzon-usuario-detalle.component.html',
  styles: []
})
export class BuzonUsuarioDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  buzon: Buzon;
  buzonUsuario: BuzonUsuario;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private buzonFacade: BuzonFacade
  ) {
    if (!this.buzonUsuario) {
      this.buzonUsuario = new BuzonUsuario();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzon }) => {
        if (buzon) {
          this.buzon = buzon;
        }
      })
    );

    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(({ buzonUsuario }) => {
        if (buzonUsuario) {
          this.buzonUsuario = buzonUsuario;
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
          buzonId: this.buzon.id,
          buzonUsuarioId: this.buzonUsuario.id
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
