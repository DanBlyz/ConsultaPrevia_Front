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
import { Paginado, RespuestaObjeto } from 'src/app/comun/modelos';

import { ActoAdministrativo, PagoCpt } from '../../../modelos';
import { ActoAdministrativoFilter } from '../../../modelos/filtros';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { PagoCptFacade } from '../../../fachadas';
import { ViajeFacade } from '../../../fachadas';
@Component({
  selector: 'app-acto-administrativo-lista',
  templateUrl: './acto-administrativo-lista.component.html',
  styleUrls: []
})
export class ActoAdministrativoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalActoAdministrativo') modalActoAdministrativo: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ActoAdministrativoFilter = new ActoAdministrativoFilter();
  tipoOperacion: string;

  actoAdministrativo: ActoAdministrativo = new ActoAdministrativo();
  lista: ActoAdministrativo[];

  modalTitulo: string;
  modal: NgbModalRef;
  idActo : number;
  idViaje : number;

  constructor(
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private modalService: NgbModal,
    private pagoCptFacade: PagoCptFacade,
    private viajeFacade: ViajeFacade,
  ) {}

  ngOnInit(): void { 
    this.suscripcion.add(
      this.actoAdministrativoFacade.CorrespondenciaState$.subscribe(
        ({ listaActoAdministrativo, actoAdministrativo }) => {
          if (listaActoAdministrativo.lista) {
            if (listaActoAdministrativo.lista.length >= 0) {
              this.lista = listaActoAdministrativo.lista;
              if (listaActoAdministrativo.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaActoAdministrativo.paginado.totalRegistros,
                  listaActoAdministrativo.paginado.registrosPorPagina,
                  listaActoAdministrativo.paginado.totalPaginas,
                  listaActoAdministrativo.paginado.pagina
                );
              }
            }
          }
          if (actoAdministrativo) {
            this.actoAdministrativo = actoAdministrativo;
          }
        }
      )
    );
    this.suscripcion.add(
      this.actoAdministrativoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.actoAdministrativoFacade.buscar(
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
    const actoAdministrativoTitulo = 'actoAdministrativo';
    console.log(evento.opcion);
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + actoAdministrativoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.actoAdministrativoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + actoAdministrativoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.actoAdministrativoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + actoAdministrativoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.actoAdministrativoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + actoAdministrativoTitulo;
        this.mostrarModal();
        break;
      }
      case 'pagoCpt': {
        this.tipoOperacion = 'pagoCpt';
        this.idActo = evento.id;
        console.log(this.idActo);
        this.modalTitulo = 'Crear Pago Cpt';
        this.mostrarModal();
        break;
      }
      case 'viaje': {
        this.tipoOperacion = 'viaje';
        this.idViaje = evento.id;
        console.log(this.idActo);
        this.modalTitulo = 'Programar Viaje';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.actoAdministrativoFacade.guardar(evento.actoAdministrativo).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.actoAdministrativoFacade
          .modificar(evento.actoAdministrativoId, evento.actoAdministrativo)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.actoAdministrativoFacade.eliminar(evento.actoAdministrativoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.actoAdministrativoFacade.establecerFiltro(evento.actoAdministrativo);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardaPagoCpt': {
        evento.pagoCpt.fk_idActos = this.idActo;
        console.log(this.idActo);
        this.pagoCptFacade.guardar(evento.pagoCpt).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'guardarViaje': {
        evento.viaje.fk_idActos = this.idViaje;
        console.log(this.idActo);
        this.viajeFacade.guardar(evento.viaje).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      
    }
  }

  paginar(): void {
    if (this.paginador) {
      this.actoAdministrativoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalActoAdministrativo, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
