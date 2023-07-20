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
import { InformeFacade } from '../../../fachadas';
import { Router } from '@angular/router';
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
  arr = this.router.url.split('/');

  modalTitulo: string;
  modal: NgbModalRef;
  idActo : number;
  idViaje : number;
  fk_idTramite : number;

  constructor(
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private modalService: NgbModal,
    private pagoCptFacade: PagoCptFacade,
    private viajeFacade: ViajeFacade,
    private informeFacade: InformeFacade,
    private router: Router
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
      case 'informe': {
        this.tipoOperacion = 'informe';
        this.actoAdministrativoFacade.obtenerPorId(evento.id);
        this.fk_idTramite = evento.fk_idTramite;
        this.modalTitulo = 'Adjuntar Informe';
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
        window.location.reload();
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
        window.location.reload();
        });
        break;
      }
      case 'guardarInforme': {
        evento.informe.fk_idTramite = this.fk_idTramite;
        this.informeFacade.guardar(evento.informe).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
            const actoNuevo = {...this.actoAdministrativo};
            console.log(actoNuevo);
            var actoV = {
              fk_idTramite: actoNuevo.fk_idTramite,
              viajeRealizado: actoNuevo.viajeRealizado,
              flujo: actoNuevo.flujo,
              encargado: actoNuevo.encargado,
              estado: "INFORME"
            };
            
            this.actoAdministrativoFacade
            .modificar(actoNuevo.id, actoV)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.cerrarModal();
              }
            });
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
