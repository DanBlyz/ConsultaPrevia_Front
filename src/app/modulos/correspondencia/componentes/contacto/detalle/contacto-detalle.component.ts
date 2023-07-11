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

import { Contacto } from '../../../modelos';
import { ContactoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-contacto-detalle',
  templateUrl: './contacto-detalle.component.html',
  styles: []
})
export class ContactoDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  contacto: Contacto;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private contactoFacade: ContactoFacade
  ) {
    if (!this.contacto) {
      this.contacto = new Contacto();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.contactoFacade.CorrespondenciaState$.subscribe(({ contacto }) => {
        if (contacto) {
          this.contacto = contacto;
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
          contactoId: this.contacto.id
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
