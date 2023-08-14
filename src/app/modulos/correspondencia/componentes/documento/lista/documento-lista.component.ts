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

import { Documento } from '../../../modelos';
import { DocumentoFilter } from '../../../modelos/filtros';
import { DocumentoFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { PdfModalComponent } from '../../pdf-modal';

@Component({
  selector: 'app-documento-lista',
  templateUrl: './documento-lista.component.html',
  styleUrls: []
})
export class DocumentoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalDocumento') modalDocumento: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: DocumentoFilter = new DocumentoFilter();
  tipoOperacion: string;

  pdfUrl: string;

  documento: Documento = new Documento();
  lista: Documento[];

  modalTitulo: string;
  modal: NgbModalRef;

  arr = this.router.url.split('/');
  private totalRegistrosEncontrados: number = 0;

  constructor(
    private documentoFacade: DocumentoFacade,
    private modalService: NgbModal,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        ({ listaDocumento, documento }) => {
          if (listaDocumento.lista) {
            if (listaDocumento.lista.length >= 0) {
              this.lista = listaDocumento.lista.filter( item => item.flujo === this.arr[1]);
              this.totalRegistrosEncontrados = this.lista.length;
              if (listaDocumento.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  this.totalRegistrosEncontrados,
                  listaDocumento.paginado.registrosPorPagina,
                  listaDocumento.paginado.totalPaginas,
                  listaDocumento.paginado.pagina
                );
              }
            }
          }
          if (documento) {
            this.documento = documento;
          }
        }
      )
    );
    this.suscripcion.add(
      this.documentoFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.documentoFacade.buscar(
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
    const documentoTitulo = 'documento';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    console.log(evento.accion+" documento");
    switch (evento.accion) {
      case 'guardar': {
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.documentoFacade
          .modificar(evento.documentoId, evento.documento)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.documentoFacade.eliminar(evento.documentoId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.documentoFacade.establecerFiltro(evento.documento);
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
      this.documentoFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalDocumento, {
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
    const url = `http://localhost:3000/documentos/bajar-archivo/${filename}`;

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
    const pdfUrl = window.URL.createObjectURL(blob);
    const modalTitle = 'Vista del PDF'; // Reemplaza con el título que desees mostrar
    this.openModal(pdfUrl, modalTitle);
  }
  
  openModal(pdfUrl: string, modalTitle: string) {
    const modalRef = this.modalService.open(PdfModalComponent, { size: 'lg' });
    modalRef.componentInstance.pdfUrl = pdfUrl;
    modalRef.componentInstance.modalTitle = modalTitle;
    modalRef.componentInstance.modalRef = modalRef; // Asigna el NgbModalRef al componente hijo
  }
}
