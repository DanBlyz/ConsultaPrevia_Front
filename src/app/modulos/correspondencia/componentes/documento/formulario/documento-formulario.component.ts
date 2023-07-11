import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { FuncionesHelper } from 'src/app/comun/auxiliares';
import { Codificador } from 'src/app/comun/modelos';

import {
  Documento,
  HojaRuta,
  Participante,
  TipoDocumento
} from 'src/app/modulos/correspondencia/modelos';
import {
  ClasificacionFacade,
  DocumentoFacade,
  TipoDocumentoFacade,
  HojaRutaFacade,
  ParticipanteFacade
} from '../../../fachadas';
import { ParticipanteSeleccionComponent } from '../../participante';
import { ParticipanteContactoSeleccionComponent } from '../../participante-contacto';
import { ParticipanteGrupoSeleccionComponent } from '../../participante-grupo';

@Component({
  selector: 'app-correspondencia-documento-formulario',
  templateUrl: './documento-formulario.component.html',
  styles: []
})
export class DocumentoFormularioComponent implements OnInit, OnDestroy {
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  @ViewChild('destinatarios') destinatarios: ParticipanteSeleccionComponent;
  @ViewChild('vias') vias: ParticipanteSeleccionComponent;
  @ViewChild('remitentes') remitentes: ParticipanteSeleccionComponent;
  @ViewChild('externos') externos: ParticipanteContactoSeleccionComponent;
  @ViewChild('grupos') grupos: ParticipanteGrupoSeleccionComponent;

  fecInicial: string;

  suscripcion = new Subscription();

  formDocumento: FormGroup;
  botonOperacion: string;

  documento: Documento;
  listaTipoDocumentoCodificador: Codificador[];
  tipoDocumentoSeleccionado: TipoDocumento;
  listaClasificacionCodificador: Codificador[];

  participantePorDefecto: Participante;

  hojaRutaEncontrada: HojaRuta = null;
  hojaRutaSeleccionada = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private tipoDocumentoFacade: TipoDocumentoFacade,
    private clasificacionFacade: ClasificacionFacade,
    private participanteFacade: ParticipanteFacade,
    private documentoFacade: DocumentoFacade,
    private hojaRutaFacade: HojaRutaFacade
  ) {
    this.fecInicial = formatDate(new Date(), 'yyyy-MM-dd', this.locale);

    if (!this.documento) {
      this.documento = new Documento();
    }

    this.formDocumento = this.fb.group({
      fecha: [this.fecInicial, Validators.required],
      citeExterno: [''],
      lugar: ['La Paz', Validators.required],
      referencia: ['', Validators.required],
      prioridad: ['NORMAL', Validators.required],
      observacion: [''],
      dandoContinuidad: [''],
      tipoDocumentoId: ['', Validators.required],
      clasificacionId: [1, Validators.required],
      hojaRutaId: [null]
    });
  }

  ngOnInit(): void {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(
        async ({ documento }) => {
          if (documento && this.documento !== documento) {
            this.documento = documento;
            if (this.tipoOperacion === 'modificar' && this.documento.id) {
              const respuesta = await this.tipoDocumentoFacade.obtenerPorId(
                this.documento.tipoDocumentoId
              );
              this.tipoDocumentoSeleccionado = respuesta.objeto;
              if (this.destinatarios) {
                this.destinatarios.listaParticipante =
                  this.documento.listaParticipante.filter(
                    (item) => item.tipo === 'DESTINATARIO'
                  );
              }
              if (this.vias) {
                this.vias.listaParticipante =
                  this.documento.listaParticipante.filter(
                    (item) => item.tipo === 'VIA'
                  );
              }
              if (this.remitentes) {
                this.remitentes.listaParticipante =
                  this.documento.listaParticipante.filter(
                    (item) => item.tipo === 'REMITENTE'
                  );
              }
              if (this.externos) {
                this.externos.listaParticipante =
                  this.documento.listaParticipante.filter(
                    (item) => item.tipo === 'REMITENTE-EXTERNO'
                  );
              }
              if (this.grupos) {
                this.grupos.listaParticipante =
                  this.documento.listaParticipante.filter(
                    (item) => item.tipo === 'GRUPO'
                  );
              }

              this.formDocumento.patchValue({
                fecha: formatDate(
                  this.documento.fecha,
                  'yyyy-MM-dd',
                  this.locale,
                  'UTC'
                ),
                citeExterno: this.documento.citeExterno,
                lugar: this.documento.lugar,
                referencia: this.documento.referencia,
                prioridad: this.documento.prioridad,
                observacion: this.documento.observacion,
                dandoContinuidad: this.documento.dandoContinuidad,
                hojaRutaId: this.documento.hojaRutaId
              });
              this.tipoDocumentoFacade
                .obtenerCodificador()
                .then((respuesta) => {
                  this.listaTipoDocumentoCodificador = respuesta.lista;
                  if (this.documento.tipoDocumentoId) {
                    this.formDocumento.controls['tipoDocumentoId'].setValue(
                      this.documento.tipoDocumentoId
                    );
                  }
                });
              this.clasificacionFacade
                .obtenerCodificador()
                .then((respuesta) => {
                  this.listaClasificacionCodificador = respuesta.lista;
                  if (this.documento.clasificacionId) {
                    this.formDocumento.controls['clasificacionId'].setValue(
                      this.documento.clasificacionId
                    );
                  }
                });

              this.hojaRutaEncontrada = new HojaRuta();
              this.hojaRutaEncontrada.id = this.documento.hojaRutaId;
              const hojaRutaNumero = this.documento.hojaRutaNumero.split('.');
              this.hojaRutaEncontrada.numero = Number(hojaRutaNumero[0]);
              this.hojaRutaEncontrada.gestion = Number(hojaRutaNumero[1]);
              this.hojaRutaSeleccionada = true;
            }
          }
        }
      )
    );

    switch (this.tipoOperacion) {
      case 'crear':
        this.botonOperacion = 'Guardar';
        this.tipoDocumentoFacade.obtenerCodificador().then((respuesta) => {
          this.listaTipoDocumentoCodificador = respuesta.lista;
        });
        this.clasificacionFacade.obtenerCodificador().then((respuesta) => {
          this.listaClasificacionCodificador = respuesta.lista;
        });
        this.participanteFacade.obtenerPorToken().then((respuesta) => {
          this.participantePorDefecto = {
            buzonId: respuesta.objeto.buzonId,
            entidad: respuesta.objeto.entidad,
            nombre: respuesta.objeto.nombre,
            puesto: respuesta.objeto.puesto,
            tipo: 'REMITENTE',
            uniOrganizacional: respuesta.objeto.uniOrganizacional
          } as Participante;
        });
        break;
      case 'modificar':
        this.botonOperacion = 'Modificar';
        break;
      case 'crearPrevio':
        this.botonOperacion = 'Guardar Previo';
        this.tipoDocumentoFacade.obtenerCodificador().then((respuesta) => {
          this.listaTipoDocumentoCodificador = respuesta.lista;
        });
        this.clasificacionFacade.obtenerCodificador().then((respuesta) => {
          this.listaClasificacionCodificador = respuesta.lista;
        });
        this.participanteFacade.obtenerPorToken().then((respuesta) => {
          this.participantePorDefecto = {
            buzonId: respuesta.objeto.buzonId,
            entidad: respuesta.objeto.entidad,
            nombre: respuesta.objeto.nombre,
            puesto: respuesta.objeto.puesto,
            tipo: 'REMITENTE',
            uniOrganizacional: respuesta.objeto.uniOrganizacional
          } as Participante;
        });
        break;
    }
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'buscar-hoja-ruta': {
        if (evento.valor === '' || evento.valor.indexOf('.') < 0) {
          return;
        }
        this.hojaRutaFacade.obtenerPorNumero(evento.valor).then((respuesta) => {
          if (respuesta.tipoRespuesta === 'Exito') {
            this.hojaRutaEncontrada = respuesta.objeto;
          }
        });
        break;
      }
      case 'seleccionar-hoja-ruta': {
        this.hojaRutaSeleccionada = true;
        this.formDocumento.controls['hojaRutaId'].setValue(
          this.hojaRutaEncontrada.id
        );
        break;
      }
      case 'quitar-hoja-ruta': {
        this.hojaRutaEncontrada = null;
        this.hojaRutaSeleccionada = null;
        this.formDocumento.controls['hojaRutaId'].setValue(null);
        break;
      }
      case 'cancelar-busqueda': {
        this.hojaRutaEncontrada = null;
        this.hojaRutaSeleccionada = false;
        break;
      }
      case 'seleccionar-tipo-documento': {
        if (evento.id !== '') {
          this.tipoDocumentoFacade.obtenerPorId(evento.id).then((respuesta) => {
            this.tipoDocumentoSeleccionado = respuesta.objeto;
          });
        } else {
          this.tipoDocumentoSeleccionado = null;
        }
        break;
      }
    }
  }

  ejecutarAccion(evento: any): void {
    let documento = new Documento();
    switch (evento.accion) {
      case 'crear': {
        if (this.destinatarios) {
          if (this.destinatarios.listaParticipante.length === 0) {
            this.toastrService.error(
              'No se ha seleccionado ningún destinatario'
            );
            return;
          }
        } else {
          if (this.grupos && this.grupos.listaParticipante.length === 0) {
            this.toastrService.error('No se ha seleccionado ningún grupo');
            return;
          }
        }
        if (this.remitentes.listaParticipante.length === 0) {
          this.toastrService.error('No se ha seleccionado ningún remitente');
          return;
        }
        if (this.externos && this.externos.listaParticipante.length === 0) {
          this.toastrService.error(
            'No se ha seleccionado ningún remitente externo'
          );
          return;
        }
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        if (!this.externos) {
          if (!this.grupos) {
            documento = {
              ...this.formDocumento.value,
              listaParticipante: [
                ...this.destinatarios.listaParticipante,
                ...this.vias.listaParticipante,
                ...this.remitentes.listaParticipante
              ]
            };
          } else {
            documento = {
              ...this.formDocumento.value,
              listaParticipante: [
                ...this.grupos.listaParticipante,
                ...this.vias.listaParticipante,
                ...this.remitentes.listaParticipante
              ]
            };
          }
        } else {
          documento = {
            ...this.formDocumento.value,
            listaParticipante: [
              ...this.destinatarios.listaParticipante,
              ...this.vias.listaParticipante,
              ...this.remitentes.listaParticipante,
              ...this.externos.listaParticipante
            ]
          };
        }
        this.accion.emit({
          accion: 'guardar',
          documento
        });
        break;
      }
      case 'modificar': {
        if (this.destinatarios.listaParticipante.length === 0) {
          this.toastrService.error('No se ha seleccionado ningún destinatario');
          return;
        }
        if (this.remitentes.listaParticipante.length === 0) {
          this.toastrService.error('No se ha seleccionado ningún remitente');
          return;
        }
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        if (!this.externos) {
          documento = {
            ...this.formDocumento.value,
            listaParticipante: [
              ...this.destinatarios.listaParticipante,
              ...this.vias.listaParticipante,
              ...this.remitentes.listaParticipante
            ]
          };
        } else {
          documento = {
            ...this.formDocumento.value,
            listaParticipante: [
              ...this.destinatarios.listaParticipante,
              ...this.vias.listaParticipante,
              ...this.remitentes.listaParticipante,
              ...this.externos.listaParticipante
            ]
          };
        }
        delete documento.tipoDocumentoId;
        this.accion.emit({
          accion: evento.accion,
          documentoId: this.documento.id,
          documento
        });
        break;
      }
      case 'cancelar': {
        this.accion.emit({
          accion: evento.accion
        });
        break;
      }
      case 'crearPrevio': {
        if (this.destinatarios) {
          if (this.destinatarios.listaParticipante.length === 0) {
            this.toastrService.error(
              'No se ha seleccionado ningún destinatario'
            );
            return;
          }
        } else {
          if (this.grupos && this.grupos.listaParticipante.length === 0) {
            this.toastrService.error('No se ha seleccionado ningún grupo');
            return;
          }
        }
        if (this.remitentes.listaParticipante.length === 0) {
          this.toastrService.error('No se ha seleccionado ningún remitente');
          return;
        }
        if (this.externos && this.externos.listaParticipante.length === 0) {
          this.toastrService.error(
            'No se ha seleccionado ningún remitente externo'
          );
          return;
        }
        FuncionesHelper.limpiarEspacios(this.formDocumento);
        if (!this.formDocumento.valid) {
          this.formDocumento.markAllAsTouched();
          return;
        }
        if (!this.externos) {
          if (!this.grupos) {
            documento = {
              ...this.formDocumento.value,
              listaParticipante: [
                ...this.destinatarios.listaParticipante,
                ...this.vias.listaParticipante,
                ...this.remitentes.listaParticipante
              ]
            };
          } else {
            documento = {
              ...this.formDocumento.value,
              listaParticipante: [
                ...this.grupos.listaParticipante,
                ...this.vias.listaParticipante,
                ...this.remitentes.listaParticipante
              ]
            };
          }
        } else {
          documento = {
            ...this.formDocumento.value,
            listaParticipante: [
              ...this.destinatarios.listaParticipante,
              ...this.vias.listaParticipante,
              ...this.remitentes.listaParticipante,
              ...this.externos.listaParticipante
            ]
          };
        }
        documento.prioridad = 'PREVIO';
        this.accion.emit({
          accion: 'guardar',
          documento
        });
        break;
      }
    }
  }
}
