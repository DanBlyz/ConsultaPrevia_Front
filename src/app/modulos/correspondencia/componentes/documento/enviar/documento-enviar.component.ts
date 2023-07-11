import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FuncionesHelper } from 'src/app/comun/auxiliares';
import Swal from 'sweetalert2';

import {
  DocumentoFacade,
  SeguimientoFacade,
  HojaRutaFacade,
  DocumentoHojaRutaFacade
} from '../../../fachadas';
import {
  Adjunto,
  Documento,
  Anulado,
  Seguimiento,
  HojaRuta,
  DocumentoHojaRuta
} from '../../../modelos';

@Component({
  selector: 'app-correspondencia-documento-enviar',
  templateUrl: './documento-enviar.component.html',
  styles: []
})
export class DocumentoEnviarComponent implements OnInit, OnDestroy {
  @Input() redireccion: string[];
  @Input() public tipoOperacion: string;
  @Output() accion = new EventEmitter<any>();

  suscripcion = new Subscription();

  formAnulado: FormGroup;
  formVincular: FormGroup;

  documento: Documento;
  documentoAdjunto: Adjunto;
  seguimiento: Seguimiento;

  /*********** Hoja de Ruta *******/
  hojaRutaEncontrada: HojaRuta = null;
  hojaRutaSeleccionada = false;

  constructor(
    private documentoFacade: DocumentoFacade,
    private seguimientoFacade: SeguimientoFacade,
    private hojaRutaFacade: HojaRutaFacade,
    private documentoHojaRutaFacade: DocumentoHojaRutaFacade,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.formAnulado = this.fb.group({
      observacion: [null, Validators.required],
      documentoId: [null, Validators.required]
    });
    this.formVincular = this.fb.group({
      observacion: ['', Validators.required],
      hojaRutaId: [null]
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento && this.documento !== documento) {
          this.documento = documento;
          this.formAnulado.patchValue({
            documentoId: this.documento.id
          });
          this.documentoAdjunto = this.documento.listaAdjunto.find(
            (item) => item.tipo === 'DOCUMENTO'
          );
        }
      })
    );
    this.suscripcion.add(
      this.seguimientoFacade.CorrespondenciaState$.subscribe(
        ({ seguimiento }) => {
          if (seguimiento && this.seguimiento !== seguimiento) {
            this.seguimiento = seguimiento;
          }
        }
      )
    );
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }

  async ejecutarAccion(evento: any): Promise<void> {
    switch (evento.accion) {
      case 'enviar': {
        this.accion.emit({
          accion: 'guardar-contenido'
        });
        Swal.fire({
          title: '¿Está seguro que desea enviar el documento?',
          text: 'Si tiene cambios pendientes estos podrían perderse.',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, enviar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if (!this.documento.tieneDocumentoAdjunto) {
              this.documentoFacade.enviar(evento.id).then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.documentoFacade.obtenerContenidoPorDocumentoId(
                    evento.id
                  );
                  this.router.navigate(this.redireccion);
                }
              });
            } else {
              this.documentoFacade
                .enviar(evento.id, this.documentoAdjunto.id)
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.documentoFacade.obtenerContenidoPorDocumentoId(
                      evento.id
                    );
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          }
        });
        break;
      }
      case 'eliminar-adjunto': {
        Swal.fire({
          title: '¿Está seguro que desea eliminar el documento observado?',
          text: 'Ésta operación no eliminará los documentos adjunto, esta operación es irreversible',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar documento observado',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade
              .eliminarDocumentoAdjunto(evento.id)
              .then((respuesta) => {
                if (respuesta.tipoRespuesta === 'Exito') {
                  this.documentoFacade.obtenerContenidoPorDocumentoId(
                    evento.id
                  );
                }
              });
          }
        });
        break;
      }
      case 'anular': {
        FuncionesHelper.limpiarEspacios(this.formAnulado);
        if (!this.formAnulado.valid) {
          this.formAnulado.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: '¿Está seguro que desea anular el documento?',
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, anular',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // TODO: implementar formularios reactivos
              const anulado = new Anulado();
              anulado.observacion =
                this.formAnulado.controls['observacion'].value;
              anulado.instante = new Date();
              this.documentoFacade
                .anular(evento.id, this.seguimiento.id, anulado)
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formAnulado.controls['observacion'].setValue('');
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          });
        }
        break;
      }
      case 'vincular-hoja-ruta': {
        FuncionesHelper.limpiarEspacios(this.formVincular);
        if (!this.formVincular.valid) {
          this.formVincular.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: `¿Está seguro que desea vincular a la hoja de ruta ${evento.hojaRutaOrigen}?`,
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, vincular',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              const documentoHojaRuta = new DocumentoHojaRuta();
              documentoHojaRuta.instante = new Date();
              documentoHojaRuta.observacion =
                this.formVincular.controls['observacion'].value;
              documentoHojaRuta.hojaRutaOrigen = evento.hojaRutaOrigen;
              documentoHojaRuta.hojaRutaDestino = evento.hojaRutaDestino;
              documentoHojaRuta.documentoId = evento.id;
              documentoHojaRuta.hojaRutaIdOrigen = evento.hojaRutaIdOrigen;
              documentoHojaRuta.hojaRutaIdDestino = evento.hojaRutaIdDestino;
              this.documentoHojaRutaFacade
                .guardar(documentoHojaRuta)
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formVincular.controls['observacion'].setValue('');
                    this.documentoFacade.obtenerPorId(this.documento.id);
                  }
                });
            }
          });
        }
        break;
      }
      case 'generarCiteHr': {
        this.accion.emit({
          accion: 'guardar-contenido'
        });
        Swal.fire({
          title: '¿Está seguro que desea generar CITE y HR para el documento?',
          text: 'Tenga en cuenta que, si acepta la operación, se generará eñ siguiente CITE y HR. y estos no podrán modificarse',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, generar CITE y HR.',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.documentoFacade.generarCiteHr(evento.id).then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.documentoFacade.obtenerContenidoPorDocumentoId(evento.id);
                this.router.navigate(this.redireccion);
              }
            });
          }
        });
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
      case 'buscar-hoja-ruta': {
        if (evento.valor !== '') {
          this.hojaRutaFacade
            .obtenerPorNumero(evento.valor)
            .then((respuesta) => {
              if (respuesta.tipoRespuesta === 'Exito') {
                this.hojaRutaEncontrada = respuesta.objeto;
              }
            });
        }
        break;
      }
      case 'seleccionar-hoja-ruta': {
        this.hojaRutaSeleccionada = true;
        this.formVincular.controls['hojaRutaId'].setValue(
          this.hojaRutaEncontrada.id
        );
        break;
      }
      case 'quitar-hoja-ruta': {
        this.hojaRutaEncontrada = null;
        this.hojaRutaSeleccionada = null;
        this.formVincular.controls['hojaRutaId'].setValue(null);
        break;
      }
      case 'cancelar-busqueda': {
        this.hojaRutaEncontrada = null;
        this.hojaRutaSeleccionada = false;
        break;
      }
    }
  }
}
