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

import { Grupo, GrupoBuzon } from '../../../modelos';
import { GrupoFilter } from '../../../modelos/filtros';
import { GrupoFacade, GrupoBuzonFacade } from '../../../fachadas';

@Component({
  selector: 'app-correspondencia-grupo-buzon-lista',
  templateUrl: './grupo-buzon-lista.component.html',
  styles: []
})
export class GrupoBuzonListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalGrupo') modalGrupo: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: GrupoFilter = new GrupoFilter();

  tipoOperacion: string;
  tipoMovilidad: string;

  grupoId: number;
  grupo: Grupo = new Grupo();
  lista: GrupoBuzon[];
  grupoBuzon: GrupoBuzon = new GrupoBuzon();

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private grupoFacade: GrupoFacade,
    private grupoBuzonFacade: GrupoBuzonFacade,
    private modalService: NgbModal
  ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      if (params.has('grupoId')) {
        this.grupoId = parseInt(params.get('grupoId'), 10);
        this.grupoFacade.obtenerPorId(this.grupoId);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.grupoFacade.CorrespondenciaState$.subscribe(
        ({ listaGrupoBuzon, grupo }) => {
          if (listaGrupoBuzon.lista) {
            if (listaGrupoBuzon.lista.length >= 0) {
              this.lista = listaGrupoBuzon.lista;
              if (listaGrupoBuzon.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaGrupoBuzon.paginado.totalRegistros,
                  listaGrupoBuzon.paginado.registrosPorPagina,
                  listaGrupoBuzon.paginado.totalPaginas,
                  listaGrupoBuzon.paginado.pagina
                );
              }
            } /*else {
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

    //await this.grupoFacade.obtenerGrupoBuzonPorBuzonId(this.grupoId);
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
        this.grupoFacade.obtenerPorId(this.grupoId);
        this.modalTitulo = 'Asignar buzón al grupo';
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.grupoFacade.obtenerPorId(this.grupoId);
        //this.grupoFacade.obtenerBuzonUsuarioPorId(this.buzonId, evento.id);
        this.modalTitulo = 'Ver detalles de asignación de grupo';
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.grupoFacade.obtenerPorId(this.grupoId);
        //this.grupoFacade.obtenerBuzonUsuarioPorId(this.grupoId, evento.id);
        this.modalTitulo = 'Modificar asignación de grupo';
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.grupoFacade.obtenerPorId(this.grupoId);
        //this.buzonFacade.obtenerBuzonUsuarioPorId(this.buzonId, evento.id);
        this.modalTitulo = 'Eliminar asignación de buzón';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      // case 'guardar': {
      //   this.grupoFacade
      //     .guardarGrupoBuzon(evento.grupoId, evento.grupoBuzon)
      //     .then((respuesta) => {
      //       if (respuesta.tipoRespuesta === 'Exito') {
      //         //this.paginar();
      //         this.cerrarModal();
      //       }
      //     });
      //   break;
      // }
      // case 'modificar': {
      //   this.grupoFacade
      //     .modificarGrupoBuzon(
      //       evento.grupoId,
      //       evento.grupoBuzonId,
      //       evento.grupoBuzon
      //     )
      //     .then((respuesta) => {
      //       if (respuesta.tipoRespuesta === 'Exito') {
      //         this.paginar();
      //         this.cerrarModal();
      //       }
      //     });
      //   break;
      // }
      // case 'eliminar': {
      //   this.grupoFacade
      //     .eliminarGrupoBuzon(evento.buzonId, evento.grupoBuzonId)
      //     .then((respuesta) => {
      //       if (respuesta.tipoRespuesta === 'Exito') {
      //         this.cerrarModal();
      //       }
      //     });
      //   break;
      // }
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
