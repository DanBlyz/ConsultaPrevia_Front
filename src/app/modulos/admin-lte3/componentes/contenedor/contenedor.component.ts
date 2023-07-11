import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import * as ComunAcciones from 'src/app/comun/estados';
import { SeguridadFacade } from 'src/app/seguridad/fachadas';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-lte3-contenedor',
  templateUrl: './contenedor.component.html',
  styles: []
})
export class ContenedorComponent implements OnInit, OnDestroy {
  suscripcion: Subscription = new Subscription();

  procesando: boolean;
  titulo: string;
  mensaje: string;

  constructor(
    private store: Store,
    private seguridadFacade: SeguridadFacade,
    private toastr: ToastrService,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ titulo, mensaje }) => {
        this.titulo = titulo || environment.denominacion;
        this.mensaje = mensaje || 'Cargando información';
      })
    );
    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ procesando }) => {
        if (procesando) {
          this.spinnerService.show('spinner-contenedor', {
            bdColor: 'rgba(0, 0, 0, 0.8)',
            size: 'medium',
            color: '#fff',
            type: 'ball-atom',
            fullScreen: true
          });
        } else {
          this.spinnerService.hide('spinner-contenedor');
        }
        this.procesando = procesando;
      })
    );
    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ respuesta }) => {
        if (respuesta) {
          this.store.dispatch(
            ComunAcciones.establecerProcesando({ procesando: false })
          );
          let tipoRespuesta: SweetAlertIcon;
          switch (respuesta.tipoRespuesta) {
            case 'Exito':
              tipoRespuesta = 'success';
              break;
            case 'Error':
              tipoRespuesta = 'error';
              break;
            case 'Excepcion':
              tipoRespuesta = 'warning';
              break;
          }
          Swal.fire({
            icon: tipoRespuesta,
            title: respuesta.titulo,
            text: respuesta.mensaje,
            showCancelButton: false,
            allowEnterKey: true,
            allowOutsideClick: false
          });
          this.store.dispatch(ComunAcciones.limpiarRespuesta());
        }
      })
    );
    this.suscripcion.add(
      this.seguridadFacade.ComunState$.subscribe(({ notificacion }) => {
        if (notificacion) {
          switch (notificacion.tipoRespuesta) {
            case 'Exito':
              this.toastr.success(notificacion.mensaje, notificacion.titulo);
              break;
            case 'Error':
              this.toastr.error(notificacion.mensaje, notificacion.titulo);
              break;
            case 'Excepcion':
              this.toastr.warning(notificacion.mensaje, notificacion.titulo);
              break;
          }
          this.store.dispatch(ComunAcciones.limpiarNotificacion());
        }
      })
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
