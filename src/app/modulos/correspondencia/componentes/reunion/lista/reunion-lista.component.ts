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

  constructor(
    private reunionFacade: ReunionFacade,
    private modalService: NgbModal
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
    }
  }

  ejecutarAccion(evento: any): void {
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
