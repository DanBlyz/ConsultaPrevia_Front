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

import { Resolucion } from '../../../modelos';
import { ResolucionFilter } from '../../../modelos/filtros';
import { ResolucionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
@Component({
  selector: 'app-resolucion-lista',
  templateUrl: './resolucion-lista.component.html',
  styleUrls: []
})
export class ResolucionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalResolucion') modalResolucion: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ResolucionFilter = new ResolucionFilter();
  tipoOperacion: string;
  arr = this.router.url.split('/');

  resolucion: Resolucion = new Resolucion();
  lista: Resolucion[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private resolucionFacade: ResolucionFacade,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.resolucionFacade.CorrespondenciaState$.subscribe(
        ({ listaResolucion, resolucion }) => {
          if (listaResolucion.lista) {
            if (listaResolucion.lista.length >= 0) {
              this.lista = listaResolucion.lista;
              if (listaResolucion.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaResolucion.paginado.totalRegistros,
                  listaResolucion.paginado.registrosPorPagina,
                  listaResolucion.paginado.totalPaginas,
                  listaResolucion.paginado.pagina
                );
              }
            }
          }
          if (resolucion) {
              this.resolucion = resolucion;
          }
        }
      )
    );
    this.suscripcion.add(
      this.resolucionFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.resolucionFacade.buscar(
            this.filtro,
            1,
            this.paginador.registrosPorPagina
          );
        }
        console.log(filtro);
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
    const resolucionTitulo = 'resolucion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.resolucionFacade.guardar(evento.resolucion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.resolucionFacade
          .modificar(evento.resolucionId, evento.resolucion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.resolucionFacade.eliminar(evento.resolucionId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.resolucionFacade.establecerFiltro(evento.resolucion);
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
      this.resolucionFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalResolucion, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
