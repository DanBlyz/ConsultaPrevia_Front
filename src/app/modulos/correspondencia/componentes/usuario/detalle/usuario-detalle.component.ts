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

import { Usuario } from '../../../modelos';
import { UsuarioFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styles: []
})
export class UsuarioDetalleComponent implements OnInit, OnDestroy {
  @Input() tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  botonOperacion: string;

  usuario: Usuario;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuarioFacade: UsuarioFacade
  ) {
    if (!this.usuario) {
      this.usuario = new Usuario();
    }
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.usuarioFacade.CorrespondenciaState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuario = usuario;
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
          contactoId: this.usuario.id
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
