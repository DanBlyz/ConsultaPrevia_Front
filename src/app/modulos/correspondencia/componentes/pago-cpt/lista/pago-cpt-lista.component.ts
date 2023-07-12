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

import { PagoCpt } from '../../../modelos';
import { PagoCptFilter } from '../../../modelos/filtros';
import { PagoCptFacade } from '../../../fachadas';

@Component({
  selector: 'app-pago-cpt-lista',
  templateUrl: './pago-cpt-lista.component.html',
  styleUrls: []
})
export class PagoCptListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalPagoCpt') modalPagoCpt: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: PagoCptFilter = new PagoCptFilter();
  tipoOperacion: string;

  pagoCpt: PagoCpt = new PagoCpt();
  lista: PagoCpt[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private pagoCptFacade: PagoCptFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.pagoCptFacade.CorrespondenciaState$.subscribe(
        ({ listaPagoCpt, pagoCpt }) => {
          if (listaPagoCpt.lista) {
            if (listaPagoCpt.lista.length >= 0) {
              this.lista = listaPagoCpt.lista;
              if (listaPagoCpt.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaPagoCpt.paginado.totalRegistros,
                  listaPagoCpt.paginado.registrosPorPagina,
                  listaPagoCpt.paginado.totalPaginas,
                  listaPagoCpt.paginado.pagina
                );
              }
            }
          }
          if (pagoCpt) {
            this.pagoCpt = pagoCpt;
          }
        }
      )
    );
    this.suscripcion.add(
      this.pagoCptFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.pagoCptFacade.buscar(
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
    const pagoCptTitulo = 'pagoCpt';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + pagoCptTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.pagoCptFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + pagoCptTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.pagoCptFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + pagoCptTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.pagoCptFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + pagoCptTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.pagoCptFacade.guardar(evento.pagoCpt).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.pagoCptFacade
          .modificar(evento.pagoCptId, evento.pagoCpt)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.pagoCptFacade.eliminar(evento.pagoCptId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.pagoCptFacade.establecerFiltro(evento.pagoCpt);
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
      this.pagoCptFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalPagoCpt, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
