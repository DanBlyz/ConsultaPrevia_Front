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

import { SujetoIdentificado } from '../../../modelos';
import { SujetoIdentificadoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-sujeto-identificado-detalle',
  templateUrl: './sujeto-identificado-detalle.component.html',
  styles: []
})
export class SujetoIdentificadoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  sujetoIdentificado: SujetoIdentificado;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private sujetoIdentificadoFacade: SujetoIdentificadoFacade
  ) {
    if (!this.sujetoIdentificado) {
      this.sujetoIdentificado = new SujetoIdentificado();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.sujetoIdentificadoFacade.CorrespondenciaState$.subscribe(({ sujetoIdentificado }) => {
        if (sujetoIdentificado) {
          this.sujetoIdentificado = sujetoIdentificado;
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
          sujetoIdentificadoId: this.sujetoIdentificado.id
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
