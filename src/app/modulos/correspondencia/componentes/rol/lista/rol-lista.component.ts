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

import { Rol } from '../../../modelos';
import { RolFilter } from '../../../modelos/filtros';
import { RolFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-rol-lista',
  templateUrl: './rol-lista.component.html',
  styles: []
})
export class RolListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalRol') modalGrupo: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: RolFilter = new RolFilter();

  tipoOperacion: string;

  rol: Rol = new Rol();
  lista: Rol[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private rolFacade: RolFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.rolFacade.CorrespondenciaState$.subscribe(
        ({ listaRol, rol }) => {
          if (listaRol.lista) {
            if (listaRol.lista.length >= 0) {
              this.lista = listaRol.lista;
              if (listaRol.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaRol.paginado.totalRegistros,
                  listaRol.paginado.registrosPorPagina,
                  listaRol.paginado.totalPaginas,
                  listaRol.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (rol) {
            this.rol = rol;
          }
        }
      )
    );
    this.suscripcion.add(
      this.rolFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.rolFacade.buscar(
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
    const rolTitulo = 'rol';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + rolTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.rolFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + rolTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.rolFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + rolTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.rolFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + rolTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.rolFacade.guardar(evento.grupo).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.rolFacade
          .modificar(evento.grupoId, evento.grupo)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.rolFacade.eliminar(evento.grupoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.rolFacade.establecerFiltro(evento.grupo);
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
      this.rolFacade.buscar(
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
