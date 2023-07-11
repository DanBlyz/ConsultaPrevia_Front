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
import { ActivatedRoute } from '@angular/router';

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { Buzon, BuzonUsuario } from '../../../modelos';
import { BuzonFilter } from '../../../modelos/filtros';
import { BuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-buzon-usuario-lista',
  templateUrl: './buzon-usuario-lista.component.html',
  styles: []
})
export class BuzonUsuarioListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalBuzon') modalBuzon: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: BuzonFilter = new BuzonFilter();

  tipoOperacion: string;
  tipoMovilidad: string;

  buzonId: number;
  buzon: Buzon = new Buzon();
  lista: BuzonUsuario[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private buzonFacade: BuzonFacade,
    private modalService: NgbModal
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('buzonId')) {
        this.buzonId = parseInt(params.get('buzonId'), 10);
        this.buzonFacade.obtenerPorId(this.buzonId);
        this.buzonFacade.obtenerBuzonUsuarioPorBuzonId(this.buzonId);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.buzonFacade.CorrespondenciaState$.subscribe(
        ({ listaBuzonUsuario, buzon }) => {
          if (listaBuzonUsuario.lista) {
            if (listaBuzonUsuario.lista.length >= 0) {
              this.lista = listaBuzonUsuario.lista;
              if (listaBuzonUsuario.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaBuzonUsuario.paginado.totalRegistros,
                  listaBuzonUsuario.paginado.registrosPorPagina,
                  listaBuzonUsuario.paginado.totalPaginas,
                  listaBuzonUsuario.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (buzon) {
            this.buzon = buzon;
          }
        }
      )
    );
    this.suscripcion.add(
      this.buzonFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.buzonFacade.buscar(
            this.filtro,
            1,
            this.paginador.registrosPorPagina
          );
        }
      })
    );

    await this.buzonFacade.obtenerBuzonUsuarioPorBuzonId(this.buzonId);
  }

  ngAfterViewInit(): void {
    this.paginar();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.buzonFacade.obtenerPorId(this.buzonId);
        this.modalTitulo = 'Asignar usuario al buzón';
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.buzonFacade.obtenerPorId(this.buzonId);
        this.buzonFacade.obtenerBuzonUsuarioPorId(this.buzonId, evento.id);
        this.modalTitulo = 'Ver detalles de asignación de buzón';
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.buzonFacade.obtenerPorId(this.buzonId);
        this.buzonFacade.obtenerBuzonUsuarioPorId(this.buzonId, evento.id);
        this.modalTitulo = 'Modificar asignación de buzón';
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.buzonFacade.obtenerPorId(this.buzonId);
        this.buzonFacade.obtenerBuzonUsuarioPorId(this.buzonId, evento.id);
        this.modalTitulo = 'Eliminar asignación de buzón';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.buzonFacade
          .guardarBuzonUsuario(evento.buzonId, evento.buzonUsuario)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'modificar': {
        this.buzonFacade
          .modificarBuzonUsuario(
            evento.buzonId,
            evento.buzonUsuarioId,
            evento.buzonUsuario
          )
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.buzonFacade.obtenerPorId(this.buzonId);
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.buzonFacade
          .eliminarBuzonUsuario(evento.buzonId, evento.buzonUsuarioId)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
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
      this.buzonFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalBuzon, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
