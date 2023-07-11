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

import { Tramite } from '../../../modelos';
import { TramiteFilter } from '../../../modelos/filtros';
import { ProvidenciaFacade, TramiteFacade,NotificacionFacade } from '../../../fachadas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tramite-lista',
  templateUrl: './tramite-lista.component.html',
  styleUrls: []
})
export class TramiteListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalTramite') modalTramite: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: TramiteFilter = new TramiteFilter();
  tipoOperacion: string;

  tramite: Tramite = new Tramite();
  lista: Tramite[];

  modalTitulo: string;
  modal: NgbModalRef;

  idTra: number;

  constructor(
    private tramiteFacade: TramiteFacade,
    private modalService: NgbModal,
    private providenciaFacade: ProvidenciaFacade, 
    private notificacionFacade: NotificacionFacade,
    private router : Router,
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.tramiteFacade.CorrespondenciaState$.subscribe(
        ({ listaTramite, tramite }) => {
          if (listaTramite.lista) {
            if (listaTramite.lista.length >= 0) {
              this.lista = listaTramite.lista;
              if (listaTramite.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaTramite.paginado.totalRegistros,
                  listaTramite.paginado.registrosPorPagina,
                  listaTramite.paginado.totalPaginas,
                  listaTramite.paginado.pagina
                );
              }
            }
          }
          if (tramite) {
            this.tramite = tramite;
          }
        }
      )
    );
    this.suscripcion.add(
      this.tramiteFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.tramiteFacade.buscar(
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
    const tramiteTitulo = 'tramite';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'providencia': {
        this.tipoOperacion = 'providencia';
        this.idTra = evento.id;
        console.log(evento.id);
        this.modalTitulo = 'Adjuntar ' + "Providencia";
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.idTra = evento.id;
        console.log(evento.id);
        this.modalTitulo = 'Adjuntar ' + "Notificacion";
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.tramiteFacade.guardar(evento.tramite).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.tramiteFacade
          .modificar(evento.tramiteId, evento.tramite)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.tramiteFacade.eliminar(evento.tramiteId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.tramiteFacade.establecerFiltro(evento.tramite);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardarpro': {
        console.log(evento.tramiteId);
        evento.providencia.fk_idTramite=this.idTra;
        this.providenciaFacade.guardar(evento.providencia).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'guardarnoti': {
        console.log(evento.tramiteId);
        evento.notificacion.fk_idTramite=this.idTra;
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
    }
  }

  paginar(): void {
    if (this.paginador) {
      this.tramiteFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalTramite, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
