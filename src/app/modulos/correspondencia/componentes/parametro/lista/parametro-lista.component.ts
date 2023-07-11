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

import { Parametro } from '../../../modelos';
import { ParametroFilter } from '../../../modelos/filtros';
import { ParametroFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-parametro-lista',
  templateUrl: './parametro-lista.component.html',
  styles: []
})
export class ParametroListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalParametro') modalParametro: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ParametroFilter = new ParametroFilter();
  tipoOperacion: string;

  parametro: Parametro = new Parametro();
  lista: Parametro[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private parametroFacade: ParametroFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.parametroFacade.CorrespondenciaState$.subscribe(
        ({ listaParametro, parametro }) => {
          if (listaParametro.lista) {
            if (listaParametro.lista.length >= 0) {
              this.lista = listaParametro.lista;
              if (listaParametro.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaParametro.paginado.totalRegistros,
                  listaParametro.paginado.registrosPorPagina,
                  listaParametro.paginado.totalPaginas,
                  listaParametro.paginado.pagina
                );
              }
            }
          }
          if (parametro) {
            this.parametro = parametro;
          }
        }
      )
    );
    this.suscripcion.add(
      this.parametroFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.parametroFacade.buscar(
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

  ejecutarOperacion(operacion: string, id: any): void {
    const parametroTitulo = 'parametro';
    switch (operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + parametroTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.parametroFacade.obtenerPorId(id);
        this.modalTitulo = 'Ver detalles de ' + parametroTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.parametroFacade.obtenerPorId(id);
        this.modalTitulo = 'Modificar ' + parametroTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.parametroFacade.obtenerPorId(id);
        this.modalTitulo = 'Eliminar ' + parametroTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.parametroFacade.guardar(evento.parametro).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.parametroFacade
          .modificar(evento.parametroId, evento.parametro)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.parametroFacade.eliminar(evento.parametroId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.parametroFacade.establecerFiltro(evento.parametro);
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
      this.parametroFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalParametro, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
