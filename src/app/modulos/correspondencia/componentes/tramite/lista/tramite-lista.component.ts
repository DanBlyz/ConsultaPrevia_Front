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
import { ProvidenciaFacade, TramiteFacade,NotificacionFacade,DocumentoFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Location } from '@angular/common';
import { ReporteService } from '../../../servicios';
import { ECNamedCurves } from 'pkijs';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-tramite-lista',
  templateUrl: './tramite-lista.component.html',
  styleUrls: []
})
export class TramiteListaComponent
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
    private reporteService: ReporteService,
    private documentoFacade: DocumentoFacade

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
    for (const tramiteItem of this.lista) {
      this.cambiarEstadoTramite(tramiteItem.id);
    }
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
        this.modalTitulo = 'Adjuntar ' + "Providencia";
        this.mostrarModal();
        break;
      }
      case 'notificacion': {
        this.tipoOperacion = 'notificacion';
        this.idTra = evento.id;
        this.modalTitulo = 'Adjuntar ' + "Notificacion";
        this.mostrarModal();
        break;
      }
      case 'documento': {
        this.tipoOperacion = 'documento';
        this.idTra = evento.id;
        this.modalTitulo = 'Adjuntar ' + "Documento";
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
        const body = { estadoAccion : 'PROVIDENCIA'}
        this.tramiteFacade.modificar(this.idTra,body);
        break;
      }
      case 'guardarnoti': {
        evento.notificacion.fk_idTramite=this.idTra;
        this.notificacionFacade.guardar(evento.notificacion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const body = { estadoAccion : 'NOTIFICADO'}
        this.tramiteFacade.modificar(this.idTra,body);
        this.router.navigate(['/Identificacion/actos-administrativos']);
        break;
      }
      case 'guardarDocumento': {
        evento.documento.fk_idTramite=this.idTra;
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const body = { estadoAccion : 'PROVIDENCIA'}
        this.tramiteFacade.modificar(this.idTra,body);
        //this.router.navigate(['/Identificacion/actos-administrativos']);
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
  imprimirPdfTramite(){
    let date = new Date();
    const fecha = date.toLocaleDateString(); // Por ejemplo, "11/07/2023" (depende de la configuración regional del navegador)
    const hora = date.toLocaleTimeString();
    console.log(this.filtro);
    const atributos = Object.keys(this.filtro);
    console.log(atributos+" atributos");
    let cadena = this.paginador.totalRegistros+"-"+fecha+"-"+hora;
    this.reporteService.generatePdf(this.lista, cadena,atributos);
  }
  cambiarEstadoTramite(id: number) {
    this.tramiteFacade.obtenerPorId(id).then(
      (dato) => {
        if (dato && dato.objeto && dato.objeto.correlativo) {
          const correlativoTramite = dato.objeto.correlativo;
          const bodyDocumento = {
            tramite: { correlativo: correlativoTramite },
            tipoDocumento: 'Informe Social',
            estado: 'VIGENTE'
          };
  
          this.documentoFacade.buscar(bodyDocumento, 1, 1).then((documento) => {
            if (documento && documento.lista && documento.lista.length > 0) {
              const listaSujetoIdentificado = documento.lista[0].listaSujetoIdentificado || [];
              const totalAcuerdo = listaSujetoIdentificado.filter(item => item.estado === 'ACUERDO REUNION').length;
              
              console.log(`Total de sujetos identificados: ${listaSujetoIdentificado.length}, Total de acuerdos: ${totalAcuerdo}`);
              if(listaSujetoIdentificado.length === totalAcuerdo){
                const tramiteBody = {
                  estado : 'CONCLUIDO'
                }
                this.tramiteFacade.modificar(id,tramiteBody);
              }
            } else {
              console.log('No se encontró ningún documento para procesar.');
            }
          });
        } else {
          console.log('No se encontró correlativo de tramite en los datos obtenidos.');
        }
      },
      (error) => {
        console.error('Error al buscar los datos:', error);
      }
    );
  }

}
