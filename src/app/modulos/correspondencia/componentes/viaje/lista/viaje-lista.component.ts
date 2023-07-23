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

import { Viaje } from '../../../modelos';
import { ViajeFilter } from '../../../modelos/filtros';
import { ViajeFacade } from '../../../fachadas';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-viaje-lista',
  templateUrl: './viaje-lista.component.html',
  styleUrls: []
})
export class ViajeListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalViaje') modalViaje: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ViajeFilter = new ViajeFilter();
  tipoOperacion: string;

  viaje: Viaje = new Viaje();
  lista: Viaje[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private viajeFacade: ViajeFacade,
    private modalService: NgbModal,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.viajeFacade.CorrespondenciaState$.subscribe(
        ({ listaViaje, viaje }) => {
          if (listaViaje.lista) {
            if (listaViaje.lista.length >= 0) {
              this.lista = listaViaje.lista;
              if (listaViaje.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaViaje.paginado.totalRegistros,
                  listaViaje.paginado.registrosPorPagina,
                  listaViaje.paginado.totalPaginas,
                  listaViaje.paginado.pagina
                );
              }
            }
          }
          if (viaje) {
            this.viaje = viaje;
          }
        }
      )
    );
    this.suscripcion.add(
      this.viajeFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.viajeFacade.buscar(
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
    const viajeTitulo = 'viaje';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + viajeTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.viajeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + viajeTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.viajeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + viajeTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.viajeFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + viajeTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.viajeFacade.guardar(evento.viaje).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.viajeFacade
          .modificar(evento.viajeId, evento.viaje)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.viajeFacade.eliminar(evento.viajeId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.viajeFacade.establecerFiltro(evento.viaje);
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
      this.viajeFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalViaje, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
  downloadPDF(nombre: string) {
    const filename = nombre; // Reemplaza con el nombre del archivo que deseas descargar
    const url = `http://localhost:3000/viajes/bajar-archivo/${filename}`;

    this.http.get(url, { responseType: 'arraybuffer' }).subscribe(
      (data) => {
        this.showPDF(data);
      },
      (error) => {
        console.error('Error al descargar el PDF:', error);
      }
    );
  }

  showPDF(data: ArrayBuffer) {
    const blob = new Blob([data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}
