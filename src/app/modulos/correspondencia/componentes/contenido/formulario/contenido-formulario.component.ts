import {
  Component,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

import { FuncionesHelper } from '../../../../../comun/auxiliares';

import { DocumentoComponent } from '../../../../../modulos/correspondencia-plantilla/componentes';
import { ModoVisualizacion } from '../../../../../modulos/correspondencia-plantilla/enumeraciones';
import { Bloque } from '../../../../../modulos/correspondencia-plantilla/interfaces';
import {
  BuzonUsuarioFacade,
  PlantillaFacade,
  TipoDocumentoFacade
} from '../../../fachadas';
import { DocumentoFacade } from '../../../fachadas';
import { TipoDocumento } from '../../../modelos/tipo-documento.model';
import {
  Adjunto,
  BuzonUsuario,
  Contenido,
  Documento,
  Plantilla
} from '../../../modelos';

@Component({
  selector: 'app-correspondencia-contenido-formulario',
  templateUrl: './contenido-formulario.component.html',
  styles: []
})
export class ContenidoFormularioComponent implements OnInit, OnDestroy {
  @ViewChild(DocumentoComponent, { static: true })
  documentoComponente: DocumentoComponent;
  @Input() public modoVisualizacion: ModoVisualizacion;
  @Input() public estado: string;
  tipoOperacion = 'crear';

  @ViewChild('modalDocumento') modalDocumento: NgbModal;

  suscripcion = new Subscription();

  formContenido: FormGroup;

  buzonUsuario: BuzonUsuario;

  tipoDocumento: TipoDocumento;
  plantilla: Plantilla;
  documento: Documento;
  contenido: Contenido;
  listaAdjunto: Adjunto[] = [];
  listaDestinatario: any[];
  listaVia: any[];
  listaRemitente: any[];
  listaRemitenteExterno: any[];

  documentoAdjunto: Adjunto = null;
  documentoAdjuntoBase64: string = null;
  documentoNombre: string;
  formatosPermitidos = ['pdf'];
  tamanioMaximo = 50;

  modalTitulo: string;
  modal: NgbModalRef;

  tiempoAutoguardado = 540; // 9 minutos
  tiempoRestante = this.tiempoAutoguardado;
  interval;

  contenidoHashInicial = null;
  contenidoHash = null;
  contenidoSinGuardar = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private plantillaFacade: PlantillaFacade,
    private documentoFacade: DocumentoFacade,
    private buzonUsuarioFacade: BuzonUsuarioFacade,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.formContenido = this.fb.group({
      detalle: [null, Validators.required],
      plantillaId: [null, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        async ({ documento }) => {
          if (documento && this.documento !== documento) {
            this.documento = documento;
            const respuesta = await this.tipoDocumentoFacade.obtenerPorId(
              this.documento.tipoDocumentoId
            );
            if (respuesta.tipoRespuesta === 'Exito') {
              this.tipoDocumento = respuesta.objeto;
            }
            this.actualizarPropiedades();
          }
        }
      )
    );

    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        async ({ contenido }) => {
          if (contenido && this.contenido !== contenido) {
            this.contenido = contenido;
            this.formContenido.patchValue({
              id: this.contenido.id,
              detalle: this.contenido.detalle,
              plantillaId: this.contenido.plantillaId
            });
            if (this.contenido.detalle && this.contenido.detalle !== '') {
              this.documentoComponente.inicializarBloques(
                this.contenido.detalle
                  ? (JSON.parse(this.contenido.detalle) as Bloque[])
                  : [],
                this.modoVisualizacion
              );
            }
          }
        }
      )
    );

    this.suscripcion.add(
      this.plantillaFacade.CorrespondenciaState$.subscribe(
        async ({ plantilla }) => {
          if (plantilla) {
            this.plantilla = plantilla;
            this.formContenido.patchValue({
              plantillaId: this.plantilla.id
            });

            if (!this.contenido || !this.contenido.detalle) {
              this.documentoComponente.inicializarBloques(
                this.plantilla.estructura
                  ? (JSON.parse(this.plantilla.estructura) as Bloque[])
                  : [],
                this.modoVisualizacion
              );

              if (this.tipoDocumento) {
                if (this.tipoDocumento.remitente === 'INTERNO') {
                  this.documentoComponente.establecerParametros({
                    tipoDocumentoId: this.documento.tipoDocumentoId,
                    tipoDocumento: this.documento.tipoDocumentoNombre,
                    cite: this.documento.cite,
                    hojaRuta: this.documento.hojaRutaNumero,
                    destinatarios: this.listaDestinatario || [],
                    vias: this.listaVia || [],
                    remitentes: this.listaRemitente || [],
                    referencia: this.documento.referencia,
                    lugar: this.documento.lugar,
                    fecha: this.documento.fecha,
                    // copia: 'cc. Archivo',
                    iniciales: this.buzonUsuario?.iniciales.toUpperCase(),
                    adjuntos: []
                  });
                } else {
                  this.documentoComponente.establecerParametros({
                    tipoDocumentoId: this.documento.tipoDocumentoId,
                    tipoDocumento: this.documento.tipoDocumentoNombre,
                    cite: this.documento.cite,
                    citeExterno: this.documento.citeExterno,
                    hojaRuta: this.documento.hojaRutaNumero,
                    destinatarios: [],
                    vias: [],
                    remitentes: this.listaRemitente || {},
                    remitenteExterno: this.listaRemitenteExterno[0] || {},
                    referencia: this.documento.referencia,
                    lugar: this.documento.lugar,
                    instante: this.documento.instRegistro,
                    // copia: 'cc. Archivo',
                    iniciales: this.buzonUsuario?.iniciales.toUpperCase(),
                    adjuntos: []
                  });
                }
              }
            }
          }
        }
      )
    );

    if (this.modoVisualizacion === ModoVisualizacion.Registro) {
      // Iniciando autoguardado
      this.interval = setInterval(async () => {
        if (!this.contenidoHashInicial) {
          this.contenidoHashInicial =
            await this.documentoComponente.obtenerHash();
        } else {
          if (this.tiempoRestante > 0) {
            this.tiempoRestante--;
            //if (this.tiempoRestante % 10 === 0) {
            this.contenidoHash = await this.documentoComponente.obtenerHash();
            if (this.contenidoHashInicial === this.contenidoHash) {
              this.contenidoSinGuardar = false;
            } else {
              this.contenidoSinGuardar = true;
            }
            //}
          } else {
            await this.autoguardado();
            this.tiempoRestante = this.tiempoAutoguardado;
            this.contenidoHashInicial =
              await this.documentoComponente.obtenerHash();
          }
        }
      }, 1000);
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
    clearInterval(this.interval);
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'guardar': {
        Swal.fire({
          title: '¿Está seguro de modificar el contenido del documento?',
          text: '',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, guardar',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.modificarContenido();
          }
        });
        break;
      }
      case 'modificar': {
        this.cerrarModal();
        this.documentoFacade
          .modificar(this.documento.id, evento.documento)
          .then(async (respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              await this.documentoFacade.obtenerPorId(this.documento.id);
              this.actualizarPropiedades();
              await this.modificarContenido();
            }
          });
        break;
      }
      case 'cargar': {
        const adjunto = new Adjunto();
        adjunto.tipo = 'DOCUMENTO';
        adjunto.tipoMime = evento.tipoMime;
        adjunto.extension = evento.extension;
        adjunto.estaFirmado = false;
        adjunto.nomPublico = this.documento.cite.replace('/', '-');
        adjunto.archivoBase64 = evento.archivoBase64;

        this.documentoFacade
          .guardarAdjunto(this.documento.id, adjunto)
          .then((respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              this.documentoFacade.obtenerContenidoPorDocumentoId(
                this.documento.id
              );
            }
          });
        break;
      }
      case 'vista-previa': {
        await this.autoguardado();
        const respuesta =
          await this.documentoFacade.obtenerPdfBase64PorDocumentoId(evento.id);
        if (respuesta.tipoRespuesta === 'Exito') {
          this.documentoAdjuntoBase64 = respuesta.objeto.archivoBase64;
          this.documentoNombre = `${this.documento.cite.replace(
            '/',
            '-'
          )}.vista-previa.pdf`;
        } else {
          this.toastrService.error(respuesta.mensaje, 'VISTA PREVIA');
        }
        break;
      }
      case 'modo-edicion': {
        this.documentoAdjuntoBase64 = null;
        this.documentoNombre = null;
        break;
      }
      case 'descargar': {
        const respuesta =
          await this.documentoFacade.obtenerAdjuntoPorDocumentoId(
            evento.id,
            evento.adjuntoId
          );
        if (respuesta.tipoRespuesta === 'Exito') {
          FuncionesHelper.descargarArchivoBase64(
            respuesta.objeto.archivoBase64,
            `${this.documento.cite.replace('/', '-')}.firmado`,
            'pdf'
          );
        } else {
          this.toastrService.error(respuesta.mensaje, 'DESCARGAR');
        }
        break;
      }
      case 'duplicar': {
        await this.autoguardado();
        Swal.fire({
          title: '¿Está seguro que desea duplicar el documento adjunto?',
          text: 'Ésta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, duplicar documento',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade.duplicar(evento.id).then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.documentoFacade.obtenerContenidoPorDocumentoId(evento.id);
                this.router.navigate([
                  '/',
                  'correspondencia',
                  'bandeja-borradores'
                ]);
              }
            });
          }
        });
        break;
      }
      case 'cancelar': {
        this.cerrarModal();
        break;
      }
    }
  }

  async ejecutarOperacion(evento: any): Promise<void> {
    const documentoTitulo = 'documento generado';
    switch (evento.operacion) {
      case 'modificar': {
        await this.autoguardado();
        this.tipoOperacion = 'modificar';
        this.documentoFacade.obtenerPorId(evento.id);
        this.modalTitulo = 'Modificar ' + documentoTitulo;
        this.mostrarModal();
        break;
      }
      case 'adjunto-seleccionado': {
        await this.autoguardado();
        const reader = new FileReader();
        if (evento.input.target.files && evento.input.target.files.length) {
          const [file] = evento.input.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            const archivo = reader.result.toString().split(',')[1];
            const tipoMime = file.type;
            const extension = file.name
              .substring(file.name.lastIndexOf('.') + 1, file.name.length)
              .toLowerCase();
            const tamanio = file.size;

            if (!this.formatosPermitidos.includes(extension)) {
              this.toastrService.error(
                'Formato de archivo no soportado.',
                'Selección de archivo'
              );
              return;
            }

            if (tamanio > this.tamanioMaximo * 1024 * 1000) {
              this.toastrService.error(
                `El tamaño del archivo seleccionado excede el límite permitido.`,
                'Selección de archivo'
              );
              return;
            }

            Swal.fire({
              title: '¿Está seguro que desea agregar el documento?',
              text: file.name,
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, agregar',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.ejecutarAccion({
                  accion: 'cargar',
                  nombre: file.name,
                  tipoMime: tipoMime,
                  extension: extension,
                  archivoBase64: archivo
                });
              }
            });
          };
        }
        break;
      }
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

  actualizarPropiedades(): void {
    this.contenido = null;
    this.documentoAdjunto = this.documento.listaAdjunto.find(
      (item) => item.tipo === 'DOCUMENTO'
    );

    if (!this.documento.tieneContenido) {
      this.tipoOperacion = 'crear';
    } else {
      this.tipoOperacion = 'modificar';
    }

    this.formContenido.patchValue({
      id: this.documento.id
    });

    this.listaDestinatario = this.documento.listaParticipante
      .filter((item) => item.tipo === 'DESTINATARIO')
      .map((item) => {
        return {
          nombre: item.nombre,
          uniOrganizacional: item.uniOrganizacional,
          puesto: item.puesto
        };
      });

    this.listaVia = this.documento.listaParticipante
      .filter((item) => item.tipo === 'VIA')
      .map((item) => {
        return {
          nombre: item.nombre,
          uniOrganizacional: item.uniOrganizacional,
          puesto: item.puesto
        };
      });

    this.listaRemitente = this.documento.listaParticipante
      .filter((item) => item.tipo === 'REMITENTE')
      .map((item) => {
        return {
          nombre: item.nombre,
          uniOrganizacional: item.uniOrganizacional,
          puesto: item.puesto
        };
      });

    this.listaRemitenteExterno = this.documento.listaParticipante
      .filter((item) => item.tipo === 'REMITENTE-EXTERNO')
      .map((item) => {
        return {
          entidad: item.entidad,
          nombre: item.nombre,
          puesto: item.puesto
        };
      });

    this.buzonUsuarioFacade.obtenerPorToken().then((respuesta) => {
      if (respuesta.tipoRespuesta === 'Exito') {
        this.buzonUsuario = respuesta.objeto;
        this.documentoComponente.establecerParametros({
          iniciales: this.buzonUsuario.iniciales.toUpperCase()
        });
      }
    });

    if (!this.documento.tieneContenido) {
      this.plantillaFacade
        .obtenerPorTipoDocumentoId(this.documento.tipoDocumentoId)
        .then((respuesta) => {
          this.plantilla = respuesta.objeto;
          if (this.plantilla) {
            this.formContenido.patchValue({
              plantillaId: this.plantilla.id
            });
          }
        });
    }

    const nuevaListaAdjunto = this.documento.listaAdjunto.filter(
      (item) => item.tipo === 'ANEXO'
    );
    // if (
    //   this.documento.esBorrador &&
    //   this.listaAdjunto !== nuevaListaAdjunto
    // ) {
    //   if (
    //     (this.listaAdjunto.length !== 0 &&
    //       this.listaAdjunto.length !== nuevaListaAdjunto.length) ||
    //     (this.listaAdjunto.length === 0 && nuevaListaAdjunto.length === 1)
    //   ) {
    //     this.modificarContenido('modificar');
    //   }
    // }
    this.listaAdjunto = nuevaListaAdjunto;

    if (this.tipoDocumento.remitente === 'INTERNO') {
      this.documentoComponente.establecerParametros({
        tipoDocumentoId: this.documento.tipoDocumentoId,
        tipoDocumento: this.documento.tipoDocumentoNombre,
        cite: this.documento.cite,
        hojaRuta: this.documento.hojaRutaNumero,
        destinatarios: this.listaDestinatario || [],
        vias: this.listaVia || [],
        remitentes: this.listaRemitente || [],
        referencia: this.documento.referencia,
        lugar: this.documento.lugar,
        fecha: this.documento.fecha,
        // copia: 'cc. Archivo',
        iniciales: this.buzonUsuario?.iniciales.toUpperCase(),
        adjuntos: this.documento.listaAdjunto.map((item) => {
          return {
            nombre: item.nomPublico,
            enlace: null
          };
        })
      });
    } else {
      this.documentoComponente.establecerParametros({
        tipoDocumentoId: this.documento.tipoDocumentoId,
        tipoDocumento: this.documento.tipoDocumentoNombre,
        cite: this.documento.cite,
        citeExterno: this.documento.citeExterno,
        hojaRuta: this.documento.hojaRutaNumero,
        destinatarios: [],
        vias: [],
        remitentes: this.listaRemitente || {},
        remitenteExterno: this.listaRemitenteExterno[0] || {},
        referencia: this.documento.referencia,
        lugar: this.documento.lugar,
        instante: this.documento.instRegistro,
        // copia: 'cc. Archivo',
        iniciales: this.buzonUsuario?.iniciales.toUpperCase(),
        adjuntos: this.documento.listaAdjunto.map((item) => {
          return {
            nombre: item.nomPublico,
            enlace: null
          };
        })
      });
    }
  }

  async modificarContenido(): Promise<void> {
    return new Promise(async (resolve) => {
      this.contenidoHashInicial = null;
      this.documentoComponente.establecerParametros({
        adjuntos: this.documento.listaAdjunto.map((item) => {
          return {
            nombre: item.nomPublico,
            enlace: null
          };
        })
      });
      this.formContenido.patchValue({
        detalle: JSON.stringify(this.documentoComponente.obtenerDatos())
      });
      FuncionesHelper.limpiarEspacios(this.formContenido);
      if (!this.formContenido.valid) {
        this.formContenido.markAllAsTouched();
        return;
      }
      const contenido = { ...this.formContenido.value };
      if (this.tipoOperacion === 'crear') {
        this.documentoFacade
          .guardarContenido(this.documento.id, contenido)
          .then(async (respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              await this.documentoFacade.obtenerPorId(this.documento.id);
              await this.documentoFacade
                .obtenerContenidoPorDocumentoId(this.documento.id)
                .then(async () => {
                  resolve();
                });
            }
          });
      } else {
        delete contenido.id;
        delete contenido.plantillaId;
        this.documentoFacade
          .modificarContenido(this.documento.id, contenido)
          .then(async (respuesta) => {
            if (respuesta.tipoRespuesta === 'Exito') {
              await this.documentoFacade
                .obtenerContenidoPorDocumentoId(this.documento.id)
                .then(async () => {
                  resolve();
                });
            }
          });
      }
    });
  }

  async autoguardado(): Promise<void> {
    return new Promise(async (resolve) => {
      this.contenidoHashInicial = null;
      this.formContenido.patchValue({
        detalle: JSON.stringify(this.documentoComponente.obtenerDatos())
      });
      const contenido = { ...this.formContenido.value };
      if (this.tipoOperacion === 'modificar') {
        delete contenido.id;
        delete contenido.plantillaId;
      }
      this.documentoFacade
        .autoguardadoContenido(this.tipoOperacion, this.documento.id, contenido)
        .then(async (respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            resolve();
          }
        });
    });
  }
}
