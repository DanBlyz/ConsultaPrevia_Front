import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { UsuarioAutenticado } from 'src/app/seguridad/modelos';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';

@Component({
  selector: 'app-admin-lte3-encabezado',
  templateUrl: './encabezado.component.html',
  styles: []
})
export class EncabezadoComponent implements OnInit, OnDestroy {
  suscripcion = new Subscription();

  usuarioAutenticado: UsuarioAutenticado;
  puesto: string;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private seguridadFacade: SeguridadFacade,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.AutenticacionState$.subscribe(({ usuario }) => {
        if (usuario) {
          this.usuarioAutenticado = usuario;
          this.puesto = 'USUARIO';
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  cerrarSesion(): void {
    this.seguridadFacade.cerrarSesion();
    this.router.navigate([environment.paginaAutenticacion]);
  }
}
