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

import { Seguimiento } from '../../../modelos';
import { SeguimientoFilter } from '../../../modelos/filtros';
import { BandejaFacade, DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-bandeja-borrador',
  templateUrl: './bandeja-borrador.component.html',
  styles: []
})
export class BandejaBorradorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalDocumento') modalDocumento: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: SeguimientoFilter = new SeguimientoFilter();

  tipoOperacion: string;

  seguimiento: Seguimiento = new Seguimiento();
  lista: Seguimiento[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private bandejaFacade: BandejaFacade,
    private documentoFacade: DocumentoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.bandejaFacade.CorrespondenciaState$.subscribe(
        ({ listaSeguimiento, seguimiento }) => {
          if (listaSeguimiento.lista) {
            if (listaSeguimiento.lista.length >= 0) {
              this.lista = listaSeguimiento.lista;
              if (listaSeguimiento.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaSeguimiento.paginado.totalRegistros,
                  listaSeguimiento.paginado.registrosPorPagina,
                  listaSeguimiento.paginado.totalPaginas,
                  listaSeguimiento.paginado.pagina
                );
              }
            }
          }
          if (seguimiento) {
            this.seguimiento = seguimiento;
          }
        }
      )
    );
    this.suscripcion.add(
      this.bandejaFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.bandejaFacade.borrador(
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
    const seguimientoTitulo = 'documento';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + seguimientoTitulo;
        this.mostrarModal();
        break;
      }
      case 'seguimiento': {
        this.tipoOperacion = 'seguimiento';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver seguimiento de ' + seguimientoTitulo;
        this.mostrarModal();
        break;
      }
      case 'crearPrevio': {
        this.tipoOperacion = 'crearPrevio';
        this.modalTitulo = 'Crear ' + seguimientoTitulo + ' Previo';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.paginar();
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.bandejaFacade.establecerFiltro(evento.seguimiento);
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
      this.bandejaFacade.borrador(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalDocumento, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
