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

import { TipoDocumento } from '../../../modelos';
import { TipoDocumentoFilter } from '../../../modelos/filtros';
import { TipoDocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-tipo-documento-lista',
  templateUrl: './tipo-documento-lista.component.html',
  styles: []
})
export class TipoDocumentoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalTipoDocumento') modalTipoDocumento: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: TipoDocumentoFilter = new TipoDocumentoFilter();

  tipoOperacion: string;

  tipoDocumento: TipoDocumento = new TipoDocumento();
  lista: TipoDocumento[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.tipoDocumentoFacade.CorrespondenciaState$.subscribe(
        ({ listaTipoDocumento, tipoDocumento }) => {
          if (listaTipoDocumento.lista) {
            if (listaTipoDocumento.lista.length >= 0) {
              this.lista = listaTipoDocumento.lista;
              if (listaTipoDocumento.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaTipoDocumento.paginado.totalRegistros,
                  listaTipoDocumento.paginado.registrosPorPagina,
                  listaTipoDocumento.paginado.totalPaginas,
                  listaTipoDocumento.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (tipoDocumento) {
            this.tipoDocumento = tipoDocumento;
          }
        }
      )
    );
    this.suscripcion.add(
      this.tipoDocumentoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.tipoDocumentoFacade.buscar(
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
    const tipoDocumentoTitulo = 'tipo documento';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + tipoDocumentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.tipoDocumentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + tipoDocumentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.tipoDocumentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + tipoDocumentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.tipoDocumentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + tipoDocumentoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.tipoDocumentoFacade
          .guardar(evento.tipoDocumento)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'modificar': {
        this.tipoDocumentoFacade
          .modificar(evento.tipoDocumentoId, evento.tipoDocumento)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.tipoDocumentoFacade
          .eliminar(evento.tipoDocumentoId)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'buscar': {
        this.tipoDocumentoFacade.establecerFiltro(evento.tipoDocumento);
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
      this.tipoDocumentoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalTipoDocumento, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
