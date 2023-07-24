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

import { Providencia } from '../../../modelos';
import { ProvidenciaFilter } from '../../../modelos/filtros';
import { ProvidenciaFacade } from '../../../fachadas';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-providencia-lista',
  templateUrl: './providencia-lista.component.html',
  styleUrls: []
})
export class ProvidenciaListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalProvidencia') modalProvidencia: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ProvidenciaFilter = new ProvidenciaFilter();
  tipoOperacion: string;

  providencia: Providencia = new Providencia();
  lista: Providencia[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private providenciaFacade: ProvidenciaFacade,
    private modalService: NgbModal,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.providenciaFacade.CorrespondenciaState$.subscribe(
        ({ listaProvidencia, providencia }) => {
          if (listaProvidencia.lista) {
            if (listaProvidencia.lista.length >= 0) {
              this.lista = listaProvidencia.lista;
              if (listaProvidencia.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaProvidencia.paginado.totalRegistros,
                  listaProvidencia.paginado.registrosPorPagina,
                  listaProvidencia.paginado.totalPaginas,
                  listaProvidencia.paginado.pagina
                );
              }
            }
          }
          if (providencia) {
            this.providencia = providencia;
          }
        }
      )
    );
    this.suscripcion.add(
      this.providenciaFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.providenciaFacade.buscar(
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
    const providenciaTitulo = 'providencia';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + providenciaTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.providenciaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + providenciaTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.providenciaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + providenciaTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.providenciaFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + providenciaTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.providenciaFacade.guardar(evento.providencia).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.providenciaFacade
          .modificar(evento.providenciaId, evento.providencia)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.providenciaFacade.eliminar(evento.providenciaId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.providenciaFacade.establecerFiltro(evento.providencia);
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
      this.providenciaFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalProvidencia, {
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
    const url = `http://localhost:3000/providencias/bajar-archivo/${filename}`;

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
