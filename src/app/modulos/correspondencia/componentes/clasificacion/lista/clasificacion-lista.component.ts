import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Clasificacion } from '../../../modelos';
import { ClasificacionFacade } from '../../../fachadas';

@Component({
  selector: 'app-clasificacion-lista',
  templateUrl: './clasificacion-lista.component.html',
  styles: []
})
export class ClasificacionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalClasificacion') modalClasificacion: NgbModal;

  suscripcion = new Subscription();

  tipoOperacion: string;

  clasificacion: Clasificacion = new Clasificacion();
  lista: Clasificacion[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private clasificacionFacade: ClasificacionFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.clasificacionFacade.CorrespondenciaState$.subscribe(
        ({ listaClasificacion, clasificacion }) => {
          if (listaClasificacion.lista) {
            if (listaClasificacion.lista.length >= 0) {
              this.lista = listaClasificacion.lista;
            }
          }
          if (clasificacion) {
            this.clasificacion = clasificacion;
          }
        }
      )
    );
  }

  ngAfterViewInit(): void {
    this.clasificacionFacade.obtenerTodo();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    const clasificacionTitulo = 'clasificacion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + clasificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.clasificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + clasificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.clasificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + clasificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.clasificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + clasificacionTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.clasificacionFacade
          .guardar(evento.clasificacion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'modificar': {
        this.clasificacionFacade
          .modificar(evento.clasificacionId, evento.clasificacion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.clasificacionFacade
          .eliminar(evento.clasificacionId)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalClasificacion, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
