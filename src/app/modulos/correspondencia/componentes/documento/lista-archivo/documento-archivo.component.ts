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

import { Documento } from '../../../modelos';
import { DocumentoFilter } from '../../../modelos/filtros';
import { DocumentoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-documento-archivo',
  templateUrl: './documento-archivo.component.html',
  styles: []
})
export class DocumentoArchivoComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalDocumento') modalDocumento: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: DocumentoFilter = new DocumentoFilter();

  tipoOperacion: string;

  documento: Documento = new Documento();
  lista: Documento[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private documentoFacade: DocumentoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        ({ listaDocumento, documento }) => {
          if (listaDocumento.lista) {
            if (listaDocumento.lista.length >= 0) {
              this.lista = listaDocumento.lista;
              if (listaDocumento.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaDocumento.paginado.totalRegistros,
                  listaDocumento.paginado.registrosPorPagina,
                  listaDocumento.paginado.totalPaginas,
                  listaDocumento.paginado.pagina
                );
              }
            }
          }
          if (documento) {
            this.documento = documento;
          }
        }
      )
    );
    this.suscripcion.add(
      this.documentoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.documentoFacade.archivo(
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
    const documentoTitulo = 'documento';
    switch (evento.operacion) {
      case 'seguimiento': {
        this.tipoOperacion = 'seguimiento';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver seguimiento de ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'buscar': {
        this.documentoFacade.establecerFiltro(evento.documento);
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
      this.documentoFacade.archivo(
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
