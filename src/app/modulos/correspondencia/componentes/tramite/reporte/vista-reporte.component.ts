import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PaginadorComponent } from 'src/app/comun/componentes';
import { Paginado } from 'src/app/comun/modelos';

import { ActoAdministrativo, Informe, Notificacion, Providencia, Resolucion, Tramite } from '../../../modelos';
import { TramiteFilter } from '../../../modelos/filtros';
import { ProvidenciaFacade, TramiteFacade,NotificacionFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Location } from '@angular/common';
import { ReporteService } from '../../../servicios';
import { ECNamedCurves } from 'pkijs';


@Component({
  selector: 'app-tramite-reporte',
  templateUrl: './vista-reporte.component.html',
  styleUrls: []
})
export class VistaReporteComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modalTramite') modalTramite: NgbModal;
  @ViewChild(PaginadorComponent) paginador: PaginadorComponent;

  suscripcion = new Subscription();
  filtro: TramiteFilter = new TramiteFilter();
  tipoOperacion: string;

  tramite: Tramite = new Tramite();
  lista: Tramite[];
  cuerpo: any [] = [];
  cuerpo2: any [] = [];
  listaResolucion: Resolucion[] = [];
  listaProvidencia: Providencia[] = [];
  listaInforme: Informe[] = [];
  listaNotificacion: Notificacion[] = [];
  listaActoAdministrativo: ActoAdministrativo[] = [];
  

  modalTitulo: string;
  modal: NgbModalRef;

  idTra: number;
  

  constructor(
    private tramiteFacade: TramiteFacade,
    private modalService: NgbModal,
    private providenciaFacade: ProvidenciaFacade, 
    private notificacionFacade: NotificacionFacade,
    private router : Router,
    private _location: Location,
    private reporte: ReporteService

  ) {}

  ngOnInit(): void {
    this.suscripcion.add(
      this.tramiteFacade.CorrespondenciaState$.subscribe(
        ({ listaTramite, tramite }) => {
          if (listaTramite.lista) {
            if (listaTramite.lista.length >= 0) {
              this.lista = listaTramite.lista;
              if (listaTramite.paginado && this.paginador) {
                this.paginador.mostrarPaginador = true;
                this.paginador.valores = new Paginado(
                  listaTramite.paginado.totalRegistros,
                  listaTramite.paginado.registrosPorPagina,
                  listaTramite.paginado.totalPaginas,
                  listaTramite.paginado.pagina
                );
              }
            }
          }
          if (tramite) {
            this.tramite = tramite;
          }
        }
      )
    );
    this.suscripcion.add(
      this.tramiteFacade.Filtro$.subscribe((filtro) => {
        if (filtro && this.paginador) {
          this.filtro = filtro;
          this.tramiteFacade.buscar(
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
    const tramiteTitulo = 'tramite';
    switch (evento.operacion) {
      case 'crear': {
        this.tipoOperacion = 'crear';
        this.modalTitulo = 'Adjuntar ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'detalle': {
        this.tipoOperacion = 'detalle';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Ver detalles de ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'modificar': {
        this.tipoOperacion = 'modificar';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'eliminar': {
        this.tipoOperacion = 'eliminar';
        this.tramiteFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Eliminar ' + tramiteTitulo;
        this.mostrarModal();
        break;
      }
      case 'providencia': {
        this.tipoOperacion = 'providencia';
        this.idTra = evento.id;
        //console.log(evento.id);
        this.modalTitulo = 'Adjuntar ' + "Providencia";
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.idTra = evento.id;
        console.log(evento.id);
        this.modalTitulo = 'Adjuntar ' + "Notificacion";
        this.mostrarModal();
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    switch (evento.accion) {
      case 'guardar': {
        this.tramiteFacade.guardar(evento.tramite).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'modificar': {
        this.tramiteFacade
          .modificar(evento.tramiteId, evento.tramite)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.cerrarModal();
            }
          });
        break;
      }
      case 'eliminar': {
        this.tramiteFacade.eliminar(evento.tramiteId).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'buscar': {
        this.tramiteFacade.establecerFiltro(evento.tramite);
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
      case 'guardarpro': {
        console.log(evento.tramiteId);
        evento.providencia.fk_idTramite=this.idTra;
        this.providenciaFacade.guardar(evento.providencia).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        break;
      }
      case 'guardarnoti': {
        evento.notificacion.fk_idTramite=this.idTra;
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
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
      this.tramiteFacade.buscar(
        this.filtro,
        this.paginador.paginaActual,
        this.paginador.registrosPorPagina
      );
    }
  }

  mostrarModal(opciones?: any): void {
    this.modal = this.modalService.open(this.modalTramite, {
      backdrop: 'static',
      size: 'lg',
      ...opciones
    });
  }

  cerrarModal(): void {
    this.modal.close();
  }
  goBack(){
    this._location.back();
  }
  /*imprimirPdfTramite(){
    const encabezado = ["Correlativo","Area Minera","Clasificacion","Nro de Cuadriculas","Departamento",
          "Provincia", "Municipio","estado"];
    const encabezadoResolucion = ["Informe","Resolucion","Informe Aprobado","Actos Administrativos","Referencia"];
    for (let index = 0; index < this.lista.length; index++) {
      const element = this.lista[index];
      this.cuerpo[index] = [element.correlativo, element.areaMinera, element.clasificacion, element.nroCuadricula, element.departamento, element.provincia, element.municipio, element.estado];
     if (this.lista[index].listaResolucion !== null && this.lista[index].listaResolucion !== undefined) {
      this.listaResolucion = this.lista[index].listaResolucion;
       for (let j = 0; j < this.listaResolucion.length; j++) {
        const res = this.listaResolucion[j];
        this.cuerpo2[j] = [res.informe, res.resolucion, res.informeAprobado,res.actoAdministrativo, res.referencia];
       }
      }
    }

    this.reporte.imprimirPdf(encabezado,this.cuerpo,"REPORTE DE TRAMITE",true);
    this.cuerpo = [];
  }*/

  convertToPDF() {
    html2canvas(document.querySelector("#capture")).then(function(canvas) {
      var imgData = canvas.toDataURL('image/png');
        var imgWidth = 226;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
  
        var doc = new jsPDF();
        var position = 0;
  
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
        heightLeft -= pageHeight;
  
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight+10);
            heightLeft -= pageHeight;
        }
      doc.save("Dashboard.pdf");
      });
    }
  
}
