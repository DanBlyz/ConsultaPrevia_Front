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

import { Usuario } from '../../../modelos';
import { UsuarioFilter } from '../../../modelos/filtros';
import { UsuarioFacade } from '../../../fachadas';

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: []
})
export class UsuarioListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalUsuario') modalUsuario: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: UsuarioFilter = new UsuarioFilter();
  tipoOperacion: string;

  usuario: Usuario = new Usuario();
  lista: Usuario[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private usuarioFacade: UsuarioFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.usuarioFacade.CorrespondenciaState$.subscribe(
        ({ listaUsuario, usuario }) => {
          if (listaUsuario.lista) {
            if (listaUsuario.lista.length >= 0) {
              this.lista = listaUsuario.lista;
              if (listaUsuario.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaUsuario.paginado.totalRegistros,
                  listaUsuario.paginado.registrosPorPagina,
                  listaUsuario.paginado.totalPaginas,
                  listaUsuario.paginado.pagina
                );
              }
            }
          }
          if (usuario) {
            this.usuario = usuario;
          }
        }
      )
    );
    this.suscripcion.add(
      this.usuarioFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.usuarioFacade.buscar(
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
    const usuarioTitulo = 'usuario';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + usuarioTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.usuarioFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + usuarioTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.usuarioFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + usuarioTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.usuarioFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + usuarioTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.usuarioFacade.guardar(evento.usuario).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.usuarioFacade
          .modificar(evento.usuarioId, evento.usuario)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.usuarioFacade.eliminar(evento.usuarioId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.usuarioFacade.establecerFiltro(evento.usuario);
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
      this.usuarioFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalUsuario, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
