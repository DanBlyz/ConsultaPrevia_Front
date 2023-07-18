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

import { Informe } from '../../../modelos';
import { InformeFilter } from '../../../modelos/filtros';
import { InformeFacade } from '../../../fachadas';

@Component({
  selector: 'app-informe-lista',
  templateUrl: './informe-lista.component.html',
  styleUrls: []
})
export class InformeListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalInforme') modalInforme: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: InformeFilter = new InformeFilter();
  tipoOperacion: string;

  informe: Informe = new Informe();
  lista: Informe[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private informeFacade: InformeFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.informeFacade.CorrespondenciaState$.subscribe(
        ({ listaInforme, informe }) => {
          if (listaInforme.lista) {
            if (listaInforme.lista.length >= 0) {
              this.lista = listaInforme.lista;
              if (listaInforme.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaInforme.paginado.totalRegistros,
                  listaInforme.paginado.registrosPorPagina,
                  listaInforme.paginado.totalPaginas,
                  listaInforme.paginado.pagina
                );
              }
            }
          }
          if (informe) {
            this.informe = informe;
          }
        }
      )
    );
    this.suscripcion.add(
      this.informeFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.informeFacade.buscar(
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
    const informeTitulo = 'informe';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + informeTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.informeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + informeTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.informeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + informeTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.informeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + informeTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.informeFacade.guardar(evento.informe).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.informeFacade
          .modificar(evento.informeId, evento.informe)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.informeFacade.eliminar(evento.informeId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.informeFacade.establecerFiltro(evento.informe);
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
      this.informeFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalInforme, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
