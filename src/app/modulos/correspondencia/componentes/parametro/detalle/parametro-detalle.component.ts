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
import { ParametroFacade } from '../../../fachadas';
import { Parametro } from '../../../modelos';

@Component({
  selector: 'app-correspondencia-parametro-detalle',
  templateUrl: './parametro-detalle.component.html',
  styles: []
})
export class ParametroDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  parametro: Parametro;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private parametroFacade: ParametroFacade
  ) {
    if (!this.parametro) {
      this.parametro = new Parametro();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.parametroFacade.CorrespondenciaState$.subscribe(({ parametro }) => {
        if (parametro) {
          this.parametro = parametro;
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
          parametroId: this.parametro.id
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
