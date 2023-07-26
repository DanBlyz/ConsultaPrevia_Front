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

import { SujetoIdentificado } from '../../../modelos';
import { SujetoIdentificadoFilter } from '../../../modelos/filtros';
import { SujetoIdentificadoFacade } from '../../../fachadas';

@Component({
  selector: 'app-sujeto-identificado-lista',
  templateUrl: './sujeto-identificado-lista.component.html',
  styleUrls: []
})
export class SujetoIdentificadoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalSujetoIdentificado') modalSujetoIdentificado: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: SujetoIdentificadoFilter = new SujetoIdentificadoFilter();
  tipoOperacion: string;

  sujetoIdentificado: SujetoIdentificado = new SujetoIdentificado();
  lista: SujetoIdentificado[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private sujetoIdentificadoFacade: SujetoIdentificadoFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.sujetoIdentificadoFacade.CorrespondenciaState$.subscribe(
        ({ listaSujetoIdentificado, sujetoIdentificado }) => {
          if (listaSujetoIdentificado.lista) {
            if (listaSujetoIdentificado.lista.length >= 0) {
              this.lista = listaSujetoIdentificado.lista;
              if (listaSujetoIdentificado.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaSujetoIdentificado.paginado.totalRegistros,
                  listaSujetoIdentificado.paginado.registrosPorPagina,
                  listaSujetoIdentificado.paginado.totalPaginas,
                  listaSujetoIdentificado.paginado.pagina
                );
              }
            }
          }
          if (sujetoIdentificado) {
            this.sujetoIdentificado = sujetoIdentificado;
          }
        }
      )
    );
    this.suscripcion.add(
      this.sujetoIdentificadoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.sujetoIdentificadoFacade.buscar(
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
    const sujetoIdentificadoTitulo = 'Sujeto Identificado';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + sujetoIdentificadoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.sujetoIdentificadoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + sujetoIdentificadoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.sujetoIdentificadoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + sujetoIdentificadoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.sujetoIdentificadoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + sujetoIdentificadoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.sujetoIdentificadoFacade.guardar(evento.sujetoIdentificado).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.sujetoIdentificadoFacade
          .modificar(evento.sujetoIdentificadoId, evento.sujetoIdentificado)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.sujetoIdentificadoFacade.eliminar(evento.sujetoIdentificadoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.sujetoIdentificadoFacade.establecerFiltro(evento.sujetoIdentificado);
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
      this.sujetoIdentificadoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalSujetoIdentificado, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
