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

import { Documento } from '../../../modelos';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-documento-detalle',
  templateUrl: './documento-detalle.component.html',
  styles: []
})
export class DocumentoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  documento: Documento;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private DocumentoFacade: DocumentoFacade
  ) {
    if (!this.documento) {
      this.documento = new Documento();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.DocumentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento) {
          this.documento = documento;
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
          documentoId: this.documento.id
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
