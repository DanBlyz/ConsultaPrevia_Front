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

import { Reunion } from '../../../modelos';
import { ReunionFilter } from '../../../modelos/filtros';
import { ReunionFacade } from '../../../fachadas';
import { NotificacionFacade } from '../../../fachadas';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { InformeFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { PdfModalComponent } from '../../pdf-modal';

@Component({
  selector: 'app-reunion-lista',
  templateUrl: './reunion-lista.component.html',
  styleUrls: []
})
export class ReunionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalReunion') modalReunion: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: ReunionFilter = new ReunionFilter();
  tipoOperacion: string;


  reunion: Reunion = new Reunion();
  lista: Reunion[];

  modalTitulo: string;
  modal: NgbModalRef;

  idTra: number;
  idReunion: number;
  aux: Reunion;
  nroReunion : string;

  arr = this.router.url.split('/');
  private totalRegistrosEncontrados: number = 0;

  constructor(
    private reunionFacade: ReunionFacade,
    private modalService: NgbModal,
    private notificacionFacade: NotificacionFacade,
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private informeFacade: InformeFacade,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.reunionFacade.CorrespondenciaState$.subscribe(
        ({ listaReunion, reunion }) => {
          if (listaReunion.lista) {
            if (listaReunion.lista.length >= 0) {
              this.lista = listaReunion.lista.filter( item => item.flujo === this.arr[1]);
              this.totalRegistrosEncontrados = this.lista.length;
              if (listaReunion.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  this.totalRegistrosEncontrados,
                  listaReunion.paginado.registrosPorPagina,
                  listaReunion.paginado.totalPaginas,
                  listaReunion.paginado.pagina
                );
              }
            }
          }
          if (reunion) {
            this.reunion = reunion;
          }
        }
      )
    );
    this.suscripcion.add(
      this.reunionFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.reunionFacade.buscar(
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
    const reunionTitulo = 'reunion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.reunionFacade.obtenerPorId(evento.id);
        console.log( this.reunionFacade.obtenerPorId(evento.id), "aqui reunuon");
        this.modalTitulo = 'Modificar ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + reunionTitulo;
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.idTra = evento.idTramite;
        this.nroReunion = evento.nroReunion;
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Adjuntar Notificacion';
        this.mostrarModal();
        break;
      }
      case 'actoAdministrativo': {
        this.tipoOperacion = 'actoAdministrativo';
        this.idTra = evento.idTramite;
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Acto Administrativo';
        this.mostrarModal();
        break;
      }
      case 'documentoDeliberacion': {
        this.tipoOperacion = 'documentoDeliberacion';
        this.idTra = evento.idTramite;
        this.idReunion = evento.id;
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Adjuntar Documento';
        this.mostrarModal();
        break;
      }
      case 'documentoReprogramacion': {
        this.tipoOperacion = 'documentoReprogramacion';
        this.idTra = evento.idTramite;
        this.idReunion = evento.id;
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Adjuntar Documento';
        this.mostrarModal();
        break;
      }
      /*case 'notificacionActa': {
        this.tipoOperacion = 'informeDeliberacion';
        this.idTra = evento.idTramite;
        this.idReunion = evento.id;
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Adjuntar Informe';
        const reunionNueva = new Reunion();
        reunionNueva.nroReunion = evento.nroReunion;
        console.log(reunionNueva);
        this.reunionFacade.guardar(reunionNueva).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
          }
        });
        break;
      }*/
    }
  }

  ejecutarAccion(evento: any): void {
    console.log(evento.accion,"accion");
    switch (evento.accion) {
      case 'guardar': {
        this.reunionFacade.guardar(evento.reunion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        console.log(evento.reunion);
        this.reunionFacade
          .modificar(evento.reunionId, evento.reunion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.reunionFacade.eliminar(evento.reunionId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.reunionFacade.establecerFiltro(evento.reunion);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardarnoti': {
        evento.notificacion.fk_idTramite=this.idTra;
        evento.notificacion.nroReunion = this.nroReunion;
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const reunionNueva = {...this.reunion};
        reunionNueva.notificacion = null;
        if(evento.notificacion.representanteComunidad){
          const reunionV = {
            estado: "NOTIFICACION"
          };
          this.reunionFacade
            .modificar(reunionNueva.id,reunionV)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                console.log("exito")
              }
            });
        }

        break;
      }
      case 'guardarActoAdministrativo': {
        evento.actoAdministrativo.fk_idTramite=this.idTra;
        this.actoAdministrativoFacade.guardar(evento.actoAdministrativo).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const reunionNueva = {...this.reunion};
        const reunionV = {
          estado: "ACTO ADMINISTRATIVO"
        };
        
        this.reunionFacade
          .modificar(reunionNueva.id,reunionV)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              console.log("exito")
            }
          });
        break;
      }
      case 'guardarInforme': {
        evento.informe.fk_idTramite=this.idTra;
        this.informeFacade.guardar(evento.informe).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const reunionNueva = {...this.reunion};
        const reunionV = {
          estado: "DELIBERACION TERMINADA"
        };
        this.reunionFacade
          .modificar(this.idReunion,reunionV)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              console.log("exito")
            }
          });
        break;
      }
    }
  }

  paginar(): void {
    if (this.paginador) {
      this.reunionFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalReunion, {
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
    const url = `http://localhost:3000/reuniones/bajar-archivo/${filename}`;

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
