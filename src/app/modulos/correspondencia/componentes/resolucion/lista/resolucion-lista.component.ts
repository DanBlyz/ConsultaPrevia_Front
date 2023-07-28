import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { Resolucion, Reunion } from '../../../modelos';
import { ResolucionFilter } from '../../../modelos/filtros';
import { ResolucionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { NotificacionFacade } from '../../../fachadas';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { ReunionFacade } from '../../../fachadas';
@Component({
  selector: 'app-resolucion-lista',
  templateUrl: './resolucion-lista.component.html',
  styleUrls: []
})
export class ResolucionListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalResolucion') modalResolucion: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;
  @Output() datoEnviado = new EventEmitter<any>();

  suscripcion = new Subscription();
  filtro: ResolucionFilter = new ResolucionFilter();
  tipoOperacion: string;
  arr = this.router.url.split('/');
  fkTramite : number;
  nroReunion :string;

  idTra : number;
  idResolucion: number;
  informeCorrelativo : string;

  resolucion: Resolucion = new Resolucion();
  lista: Resolucion[];

  modalTitulo: string;
  modal: NgbModalRef;

  constructor(
    private resolucionFacade: ResolucionFacade,
    private modalService: NgbModal,
    private router: Router,
    private notificacionFacade: NotificacionFacade,
    private http: HttpClient,
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private reunionFacade: ReunionFacade
  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.resolucionFacade.CorrespondenciaState$.subscribe(
        ({ listaResolucion, resolucion }) => {
          if (listaResolucion.lista) {
            if (listaResolucion.lista.length >= 0) {
              this.lista = listaResolucion.lista;
              if (listaResolucion.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaResolucion.paginado.totalRegistros,
                  listaResolucion.paginado.registrosPorPagina,
                  listaResolucion.paginado.totalPaginas,
                  listaResolucion.paginado.pagina
                );
              }
            }
          }
          if (resolucion) {
              this.resolucion = resolucion;
          }
        }
      )
    );
    this.suscripcion.add(
      this.resolucionFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.resolucionFacade.buscar(
            this.filtro,
            1,
            this.paginador.registrosPorPagina
          );
        }
        console.log(filtro);
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
    const resolucionTitulo = 'resolucion';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Crear ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.fkTramite = evento.fk_tramite;
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.resolucionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + resolucionTitulo;
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.fkTramite = evento.fk_tramite;
        this.nroReunion = evento.nroReunion;
        this.informeCorrelativo = evento.informe;
        this.datoEnviado.emit(evento.informe);
        console.log("informe "+evento.informe);
        console.log(this.nroReunion);
        this.modalTitulo = 'Adjuntar Notificacion ' ;
        this.mostrarModal();
        break;
      }
      case 'actoAdministrativo': {
        this.tipoOperacion = 'actoAdministrativo';
        this.idTra = evento.fk_tramite;
        this.idResolucion = evento.id;
        this.modalTitulo = 'Acto Administrativo';
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.resolucionFacade.guardar(evento.resolucion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        evento.resolucion.fk_idTramite = this.fkTramite;
        this.resolucionFacade
          .modificar(evento.resolucionId, evento.resolucion)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.resolucionFacade.eliminar(evento.resolucionId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.resolucionFacade.establecerFiltro(evento.resolucion);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardarnoti': {
        evento.notificacion.fk_idTramite = this.fkTramite;
        evento.notificacion.nroReunion = this.nroReunion;
        console.log( evento.notificacion.nroReunion+" asfdasf");
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        
        break;
      }
      case 'guardarActoAdministrativo': {
        console.log("guardar actos");
        evento.actoAdministrativo.fk_idResolucion=this.idResolucion;
        console.log(evento.actoAdministrativo)
        this.actoAdministrativoFacade.guardar(evento.actoAdministrativo).then((respuesta) => {
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
      this.resolucionFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalResolucion, {
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
    const url = `http://localhost:3000/resoluciones/bajar-archivo/${filename}`;

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
