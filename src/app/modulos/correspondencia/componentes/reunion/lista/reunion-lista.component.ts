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

import { Reunion } from '../../../modelos';
import { ReunionFilter } from '../../../modelos/filtros';
import { ReunionFacade } from '../../../fachadas';
import { NotificacionFacade } from '../../../fachadas';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { InformeFacade } from '../../../fachadas';

@Component({
  selector: 'app-reunion-lista',
  templateUrl: './reunion-lista.component.html',
  styleUrls: []
})
export class ReunionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalReunion') modalReunion: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ReunionFilter = new ReunionFilter();
  tipoOperacion: string;

  reunion: Reunion = new Reunion();
  lista: Reunion[];

  modalTitulo: string;
  modal: NgbModalRef;

  idTra: number;

  constructor(
    private reunionFacade: ReunionFacade,
    private modalService: NgbModal,
    private notificacionFacade: NotificacionFacade,
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private informeFacade: InformeFacade
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.reunionFacade.CorrespondenciaState$.subscribe(
        ({ listaReunion, reunion }) => {
          if (listaReunion.lista) {
            if (listaReunion.lista.length >= 0) {
              this.lista = listaReunion.lista;
              if (listaReunion.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaReunion.paginado.totalRegistros,
                  listaReunion.paginado.registrosPorPagina,
                  listaReunion.paginado.totalPaginas,
                  listaReunion.paginado.pagina
                );
              }
            }
          }
          if (reunion) {
            this.reunion = reunion;
          }
        }
      )
    );
    this.suscripcion.add(
      this.reunionFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.reunionFacade.buscar(
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
    const reunionTitulo = 'reunion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.idTra = evento.idTramite;
        this.modalTitulo = 'Adjuntar Notificacion';
        this.mostrarModal();
        break;
      }
      case 'actoAdministrativo': {
        this.tipoOperacion = 'actoAdministrativo';
        this.idTra = evento.idTramite;
        this.modalTitulo = 'Acto Administrativo';
        this.mostrarModal();
        break;
      }
      case 'informeDeliberacion': {
        this.tipoOperacion = 'informeDeliberacion';
        this.idTra = evento.idTramite;
        this.modalTitulo = 'Adjuntar Informe';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    console.log(evento.accion,"accion");
    switch (evento.accion) {
      case 'guardar': {
        this.reunionFacade.guardar(evento.reunion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.reunionFacade
          .modificar(evento.reunionId, evento.reunion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.reunionFacade.eliminar(evento.reunionId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.reunionFacade.establecerFiltro(evento.reunion);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardarnoti': {
        //console.log(evento.tramiteId);
        evento.notificacion.fk_idTramite=this.idTra;
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'guardarActoAdministrativo': {
        console.log("guardar actos");
        evento.actoAdministrativo.fk_idTramite=this.idTra;
        console.log(evento.actoAdministrativo)
        this.actoAdministrativoFacade.guardar(evento.actoAdministrativo).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'guardarInforme': {
        console.log("guardar informe");
        evento.informe.fk_idTramite=this.idTra;
        console.log(evento.informe)
        this.informeFacade.guardar(evento.informe).then((respuesta) => {
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
      this.reunionFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalReunion, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
