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

import { Grupo } from '../../../modelos';
import { GrupoFilter } from '../../../modelos/filtros';
import { GrupoFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-lista',
  templateUrl: './grupo-lista.component.html',
  styles: []
})
export class GrupoListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalGrupo') modalGrupo: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: GrupoFilter = new GrupoFilter();

  tipoOperacion: string;

  grupo: Grupo = new Grupo();
  lista: Grupo[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private grupoFacade: GrupoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(
        ({ listaGrupo, grupo }) => {
          if (listaGrupo.lista) {
            if (listaGrupo.lista.length >= 0) {
              this.lista = listaGrupo.lista;
              if (listaGrupo.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaGrupo.paginado.totalRegistros,
                  listaGrupo.paginado.registrosPorPagina,
                  listaGrupo.paginado.totalPaginas,
                  listaGrupo.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (grupo) {
            this.grupo = grupo;
          }
        }
      )
    );
    this.suscripcion.add(
      this.grupoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.grupoFacade.buscar(
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
    const grupoTitulo = 'grupo';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + grupoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.grupoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + grupoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.grupoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + grupoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.grupoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + grupoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.grupoFacade.guardar(evento.grupo).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.grupoFacade
          .modificar(evento.grupoId, evento.grupo)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.grupoFacade.eliminar(evento.grupoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.grupoFacade.establecerFiltro(evento.grupo);
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
      this.grupoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalGrupo, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
