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

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { Notificacion } from '../../../modelos';
import { NotificacionFilter } from '../../../modelos/filtros';
import { NotificacionFacade } from '../../../fachadas';

@Component({
  selector: 'app-notificacion-lista',
  templateUrl: './notificacion-lista.component.html',
  styleUrls: []
})
export class NotificacionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalNotificacion') modalNotificacion: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: NotificacionFilter = new NotificacionFilter();
  tipoOperacion: string;

  notificacion: Notificacion = new Notificacion();
  lista: Notificacion[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private notificacionFacade: NotificacionFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.notificacionFacade.CorrespondenciaState$.subscribe(
        ({ listaNotificacion, notificacion }) => {
          if (listaNotificacion.lista) {
            if (listaNotificacion.lista.length >= 0) {
              this.lista = listaNotificacion.lista;
              if (listaNotificacion.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaNotificacion.paginado.totalRegistros,
                  listaNotificacion.paginado.registrosPorPagina,
                  listaNotificacion.paginado.totalPaginas,
                  listaNotificacion.paginado.pagina
                );
              }
            }
          }
          if (notificacion) {
            this.notificacion = notificacion;
          }
        }
      )
    );
    this.suscripcion.add(
      this.notificacionFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.notificacionFacade.buscar(
            this.filtro,
            1,
            this.paginador.registrosPorPagina
          );
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.paginar();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    const notificacionTitulo = 'notificacion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + notificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.notificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + notificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.notificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + notificacionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.notificacionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + notificacionTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.notificacionFacade
          .modificar(evento.notificacionId, evento.notificacion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.notificacionFacade.eliminar(evento.notificacionId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.notificacionFacade.establecerFiltro(evento.notificacion);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
    }
  }

  paginar(): void {
    if (this.paginador) {
      this.notificacionFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalNotificacion, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
