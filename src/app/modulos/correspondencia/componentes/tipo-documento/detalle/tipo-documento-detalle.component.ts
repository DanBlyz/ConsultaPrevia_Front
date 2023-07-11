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

import { TipoDocumento } from '../../../modelos';
import { TipoDocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-tipo-documento-detalle',
  templateUrl: './tipo-documento-detalle.component.html',
  styles: []
})
export class TipoDocumentoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  tipoDocumento: TipoDocumento;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private tipoDocumentoFacade: TipoDocumentoFacade
  ) {
    if (!this.tipoDocumento) {
      this.tipoDocumento = new TipoDocumento();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.tipoDocumentoFacade.CorrespondenciaState$.subscribe(
        ({ tipoDocumento }) => {
          if (tipoDocumento) {
            this.tipoDocumento = tipoDocumento;
          }
        }
      )
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
          tipoDocumentoId: this.tipoDocumento.id
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
