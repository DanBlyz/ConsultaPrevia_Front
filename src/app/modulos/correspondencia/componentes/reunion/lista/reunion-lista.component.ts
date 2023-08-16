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
import { ReunionFacade, TramiteFacade } from '../../../fachadas';
import { NotificacionFacade, DocumentoFacade,SujetoIdentificadoFacade,ResolucionFacade } from '../../../fachadas';
import { ActoAdministrativoFacade } from '../../../fachadas';
import { InformeFacade } from '../../../fachadas';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { PdfModalComponent } from '../../pdf-modal';
import { TramiteService ,DocumentoService, SujetoIdentificadoService,ReunionService} from '../../../servicios';

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
  listaSujetos: any[];

  modalTitulo: string;
  modal: NgbModalRef;

  idTra: number;
  idReunion: number;
  aux: Reunion;
  nroReunion : string;
  comunidad : string;

  arr = this.router.url.split('/');
  private totalRegistrosEncontrados: number = 0;

  constructor(
    private reunionFacade: ReunionFacade,
    private modalService: NgbModal,
    private notificacionFacade: NotificacionFacade,
    private actoAdministrativoFacade: ActoAdministrativoFacade,
    private informeFacade: InformeFacade,
    private router: Router,
    private http: HttpClient,
    private documentoFacade: DocumentoFacade,
    private tramiteFacade: TramiteFacade,
    private sujetoIdentificadoFacade : SujetoIdentificadoFacade,
    private resolucionFacade : ResolucionFacade,
    private sujetoIdentificadoService : SujetoIdentificadoService,
    private reunionService: ReunionService
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
      case 'documento': {
        this.tipoOperacion = 'documento';
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
      case 'resolucionAcuerdo': {
        this.tipoOperacion = 'resolucionAcuerdo';
        this.idTra = evento.idTramite;
        this.idReunion = evento.id;
        this.comunidad = evento.comunidad;
        console.log(this.comunidad)
        this.reunionFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Adjuntar Resolucion';
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
      case 'guardarDocumentoDeliberacion': {
        evento.documento.fk_idTramite=this.idTra;
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
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
      case 'guardarDocumento': {
        evento.documento.fk_idTramite=this.idTra;
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const reunionNueva = {...this.reunion};
        const reunionV = {
          estado: "REPROGRAMACION VIAJE"
        };
        this.reunionFacade
          .modificar(this.idReunion,reunionV);

        break;
      }
      case 'guardarDocumentoReprogramacion': {
        evento.documento.fk_idTramite=this.idTra;
        this.documentoFacade.guardar(evento.documento).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
        const reunionBody = {
          estado: "REPROGRAMACION VIAJE"
        };
        this.reunionFacade
          .modificar(this.idReunion,reunionBody);
        const tramiteBody = {
            estado: "INTERRUMPIDO"
        };
        this.tramiteFacade.modificar(this.idTra,tramiteBody);
        this.cambiarEstadoDocumento(this.idTra);
        this.cambiarEstadoTramite(this.idTra);
        break;
      }
      case 'guardarResolucionAcuerdo': {
        evento.resolucion.fk_idTramite=this.idTra;
        evento.resolucion.informe = this.reunion.nroReunion+" REUNION "+this.reunion.notificacion.comunidad;
        this.resolucionFacade.guardar(evento.resolucion).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.cerrarModal();
          }
        });
       const reunionV = {
          estado: "ACUERDO"
        };
        this.reunionFacade.modificar(this.idReunion,reunionV);
        this.cambiarEstadoSujeto(this.idTra,this.comunidad);
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
  async cambiarEstadoSujeto(id: number, comunidad: string) {
    try {
      const tramite = await this.tramiteFacade.obtenerPorId(id);
      if (tramite && tramite.objeto && tramite.objeto.correlativo) {
        const correlativoTramite = tramite.objeto.correlativo;
        const bodyDocumento = {
          tramite: { correlativo: correlativoTramite },
          tipoDocumento: 'Informe Social',
          estado: 'VIGENTE'
        };
  
        const documento = await this.documentoFacade.buscar(bodyDocumento, 1, 1);
        if (documento && documento.lista && documento.lista.length > 0) {
          const listaSujetoIdentificado = documento.lista[0].listaSujetoIdentificado || [];
          const sujeto = listaSujetoIdentificado.find(item => item.comunidad === comunidad);
          if (sujeto) {
            const bodySujeto = {
              estado: "ACUERDO REUNION"
            };
            await this.sujetoIdentificadoFacade.modificar(sujeto.id, bodySujeto);
            console.log(`El estado del sujeto en la comunidad ${comunidad} ha sido actualizado.`);
          } else {
            console.log('No se encontró ningún sujeto con la comunidad especificada.');
          }
        } else {
          console.log('No se encontró ningún documento para procesar.');
        }
      } else {
        console.log('No se encontró correlativo de tramite en los datos obtenidos.');
      }
    } catch (error) {
      console.error('Error al buscar los datos:', error);
    }
  }
  cambiarEstadoDocumento(id: number) {
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
            if (documento && documento.lista && documento.lista.length > 0 && documento.lista[0].id) {
              const idDocumento = documento.lista[0].id;
              const bodyDocumentoModificacion = {
                estado: 'REEMPLAZADO'
              };
              
              this.documentoFacade.modificar(idDocumento, bodyDocumentoModificacion);
            } else {
              console.log('No se encontró ningún documento para actualizar.');
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
  /*buscarCorrelativo(){
    if(this.formResolucion.get('correlativo').value !== ""){
      const body = { correlativo : this.formResolucion.get('correlativo').value};
    this.vistaDocumentoService.buscar(body, 1, 1).subscribe(
      (datos) => {
        this.datoRecuperado = datos.lista[0];
        console.log(this.datoRecuperado);
        this.formResolucion.patchValue({
          referencia: this.datoRecuperado.referencia
        });
      },
      (error) => {
        console.error('Error al buscar los datos:', error);
      }
    );
    }else{
      console.log("error de datos");
    }
  }*/
 
}
