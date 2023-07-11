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
import Swal from 'sweetalert2';

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { Seguimiento } from '../../../modelos';
import { SeguimientoFilter } from '../../../modelos/filtros';
import { BandejaFacade, DocumentoFacade } from '../../../fachadas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-correspondencia-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styles: []
})
export class BandejaEntradaComponent
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
    private router: Router,
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
          this.bandejaFacade.entrada(
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
      case 'recibir': {
        Swal.fire({
          title: '¿Está seguro que desea recibir el documento?',
          text: 'Ésta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, recibir',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade.recibir(evento.id).then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                //this.paginar();
                this.router.navigate([
                  '/',
                  'correspondencia',
                  'documentos',
                  evento.seguimientoId,
                  'derivar'
                ]);
              }
            });
          }
        });
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
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
      this.bandejaFacade.entrada(
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
