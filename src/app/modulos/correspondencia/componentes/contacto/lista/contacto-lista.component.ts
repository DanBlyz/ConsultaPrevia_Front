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

import { Contacto } from '../../../modelos';
import { ContactoFilter } from '../../../modelos/filtros';
import { ContactoFacade } from '../../../fachadas';

@Component({
  selector: 'app-contacto-lista',
  templateUrl: './contacto-lista.component.html',
  styleUrls: []
})
export class ContactoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalContacto') modalContacto: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ContactoFilter = new ContactoFilter();
  tipoOperacion: string;

  contacto: Contacto = new Contacto();
  lista: Contacto[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private contactoFacade: ContactoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.contactoFacade.CorrespondenciaState$.subscribe(
        ({ listaContacto, contacto }) => {
          if (listaContacto.lista) {
            if (listaContacto.lista.length >= 0) {
              this.lista = listaContacto.lista;
              if (listaContacto.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaContacto.paginado.totalRegistros,
                  listaContacto.paginado.registrosPorPagina,
                  listaContacto.paginado.totalPaginas,
                  listaContacto.paginado.pagina
                );
              }
            }
          }
          if (contacto) {
            this.contacto = contacto;
          }
        }
      )
    );
    this.suscripcion.add(
      this.contactoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.contactoFacade.buscar(
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
    const contactoTitulo = 'contacto';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + contactoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.contactoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + contactoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.contactoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + contactoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.contactoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + contactoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.contactoFacade.guardar(evento.contacto).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.contactoFacade
          .modificar(evento.contactoId, evento.contacto)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.contactoFacade.eliminar(evento.contactoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.contactoFacade.establecerFiltro(evento.contacto);
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
      this.contactoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalContacto, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
