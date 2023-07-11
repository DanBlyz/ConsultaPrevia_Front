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

import { Buzon } from '../../../modelos';
import { BuzonFilter } from '../../../modelos/filtros';
import { BuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-lista',
  templateUrl: './buzon-lista.component.html',
  styles: []
})
export class BuzonListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalBuzon') modalBuzon: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: BuzonFilter = new BuzonFilter();

  tipoOperacion: string;

  buzon: Buzon = new Buzon();
  lista: Buzon[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private buzonFacade: BuzonFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(
        ({ listaBuzon, buzon }) => {
          if (listaBuzon.lista) {
            if (listaBuzon.lista.length >= 0) {
              this.lista = listaBuzon.lista;
              if (listaBuzon.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaBuzon.paginado.totalRegistros,
                  listaBuzon.paginado.registrosPorPagina,
                  listaBuzon.paginado.totalPaginas,
                  listaBuzon.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (buzon) {
            this.buzon = buzon;
          }
        }
      )
    );
    this.suscripcion.add(
      this.buzonFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.buzonFacade.buscar(
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
    const buzonTitulo = 'buzon';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + buzonTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.buzonFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + buzonTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.buzonFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + buzonTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.buzonFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + buzonTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.buzonFacade.guardar(evento.buzon).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.buzonFacade
          .modificar(evento.buzonId, evento.buzon)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.buzonFacade.eliminar(evento.buzonId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.buzonFacade.establecerFiltro(evento.buzon);
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
      this.buzonFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalBuzon, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
