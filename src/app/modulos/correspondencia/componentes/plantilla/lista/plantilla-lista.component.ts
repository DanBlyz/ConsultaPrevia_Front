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

import { PaginadorComponent } from 'src/app/comun/componentes/paginador/paginador.component';
import { Paginado } from 'src/app/comun/modelos/paginado.model';

import { PlantillaFacade } from '../../../fachadas/plantilla.facade';
import { Plantilla } from '../../../modelos';
import { PlantillaFilter } from '../../../modelos/filtros';

@Component({
  selector: 'app-correspondencia-plantilla-lista',
  templateUrl: './plantilla-lista.component.html',
  styles: []
})
export class PlantillaListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalPlantilla') modalPlantilla: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();

  filtro: PlantillaFilter = new PlantillaFilter();

  tipoOperacion: string;

  objeto: Plantilla = new Plantilla();
  lista: Plantilla[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private plantillaFacade: PlantillaFacade,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.plantillaFacade.CorrespondenciaState$.subscribe(
        ({ listaPlantilla, plantilla }) => {
          if (listaPlantilla.lista) {
            if (listaPlantilla.lista.length >= 0) {
              this.lista = listaPlantilla.lista;
              if (listaPlantilla.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaPlantilla.paginado.totalRegistros,
                  listaPlantilla.paginado.registrosPorPagina,
                  listaPlantilla.paginado.totalPaginas,
                  listaPlantilla.paginado.pagina
                );
              }
            } /* else {
            if (this.paginador) {
              this.paginador.mostrarPaginador = false;
            }
          }*/
          }
          if (plantilla) {
            this.objeto = plantilla;
          }
        }
      )
    );
    this.suscripcion.add(
      this.plantillaFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.plantillaFacade.buscar(
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

  cargarControl(control: string, id: any): void {
    const objetoTitulo = 'plantilla';
    switch (control) {
      // case 'crear': {
      //   this.tipoOperacion = 'crear';
      //   this.modalTitulo = 'Crear ' + objetoTitulo;
      //   this.mostrarModal();
      //   break;
      // }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.plantillaFacade.obtenerPorId(id);
        this.modalTitulo = 'Ver detalles de ' + objetoTitulo;
        this.mostrarModal({ size: 'xl' });
        break;
      }
      // case 'modificar': {
      //   this.tipoOperacion = 'modificar';
      //   this.plantillaFacade.obtenerPorId(id);
      //   this.modalTitulo = 'Modificar ' + objetoTitulo;
      //   this.mostrarModal();
      //   break;
      // }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.plantillaFacade.obtenerPorId(id);
        this.modalTitulo = 'Eliminar ' + objetoTitulo;
        this.mostrarModal({ size: 'xl' });
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.tipoOperacion) {
      // case 'guardar': {
      //   this.plantillaFacade.guardar(evento.plantilla).then((respuesta) => {
      //     if (respuesta.tipoRespuesta === 'Exito') {
      //       this.cerrarModal();
      //     }
      //   });
      //   break;
      // }
      // case 'modificar': {
      //   this.plantillaFacade
      //     .modificar(evento.plantillaId, evento.plantilla)
      //     .then((respuesta) => {
      //       if (respuesta.tipoRespuesta === 'Exito') {
      //         this.cerrarModal();
      //       }
      //     });
      //   break;
      // }
      case 'eliminar': {
        this.plantillaFacade.eliminar(evento.plantillaId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.plantillaFacade.establecerFiltro(evento.plantilla);
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
      this.plantillaFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalPlantilla, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
}
