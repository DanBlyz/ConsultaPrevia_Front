import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FuncionesHelper } from 'src/app/comun/auxiliares';
import Swal from 'sweetalert2';

import { DocumentoFacade, SeguimientoFacade } from '../../../fachadas';
import {
  Adjunto,
  Destinatario,
  Documento,
  Participante,
  Proveido,
  Devolver
} from '../../../modelos';
import { Seguimiento, Archivado } from '../../../modelos';
import { ParticipanteSeleccionComponent } from '../../participante';

@Component({
  selector: 'app-correspondencia-documento-derivar',
  templateUrl: './documento-derivar.component.html',
  styles: []
})
export class DocumentoDerivarComponent implements OnInit, OnDestroy {
  @ViewChild('destinatarios') destinatarios: ParticipanteSeleccionComponent;
  @Input() redireccion: string[];

  suscripcion = new Subscription();

  formDerivacion: FormGroup;
  formArchivado: FormGroup;
  formDevolucion: FormGroup;

  documento: Documento;
  listaRemitenteExterno: Participante[] = [];
  documentoAdjunto: Adjunto;
  seguimiento: Seguimiento;

  constructor(
    private documentoFacade: DocumentoFacade,
    private seguimientoFacade: SeguimientoFacade,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.formDerivacion = this.fb.group({
      proveidoAccion: [null],
      proveido: [null],
      documentoId: [null, Validators.required]
    });
    this.formArchivado = this.fb.group({
      observacion: [null, Validators.required],
      documentoId: [null, Validators.required]
    });
    this.formDevolucion = this.fb.group({
      aclaracion: [null, Validators.required]
      //documentoId: [null, Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    this.suscripcion.add(
      this.documentoFacade.CorrespondenciaState$.subscribe(({ documento }) => {
        if (documento && this.documento !== documento) {
          this.documento = documento;
          this.formDerivacion.patchValue({
            documentoId: this.documento.id
          });
          this.formArchivado.patchValue({
            documentoId: this.documento.id
          });
          this.listaRemitenteExterno = this.documento.listaParticipante.filter(
            (participante) => participante.tipo === 'REMITENTE-EXTERNO'
          );
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
      case 'derivar': {
        if (this.destinatarios.listaParticipante.length === 0) {
          this.toastrService.error('No se ha seleccionado ningún destinatario');
          return;
        }
        FuncionesHelper.limpiarEspacios(this.formDerivacion);
        if (!this.formDerivacion.valid) {
          this.formDerivacion.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: '¿Está seguro que desea derivar el documento?',
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, derivar',
            cancelButtonText: 'Cancelar'
          }).then(async (result) => {
            if (result.isConfirmed) {
              // TODO: implementar formularios reactivos
              const checkboxes = document.querySelectorAll(
                'input[name="checkSeleccion"]:checked'
              );
              const valoresChecks = [];
              checkboxes.forEach((checkbox) => {
                const checkboxElementos = <HTMLInputElement>checkbox;
                valoresChecks.push(checkboxElementos.value);
              });

              const listaParticipante = this.destinatarios.listaParticipante;

              const proveido = new Proveido();
              proveido.cite = this.documento.cite;
              proveido.hojaRuta = this.documento.hojaRutaNumero;
              proveido.destinatarios = [];
              this.destinatarios.listaParticipante.forEach((participante) => {
                const destinatario = new Destinatario();
                destinatario.nombre = participante.nombre;
                destinatario.puesto = participante.puesto;
                proveido.destinatarios.push(destinatario);
              });
              proveido.acciones = valoresChecks;
              proveido.instruccion =
                this.formDerivacion.controls['proveido'].value;
              proveido.instante = new Date();
              const buzones = listaParticipante.map(
                (participante) => participante.buzonId
              );
              const destinatarios = listaParticipante.map(
                (participante) => participante.nombre
              );
              this.documentoFacade
                .derivar(
                  evento.id,
                  this.seguimiento.id,
                  buzones,
                  destinatarios,
                  proveido
                )
                .then(async (respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formDerivacion.controls['proveido'].setValue('');
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          });
        }
        break;
      }
      case 'archivar': {
        FuncionesHelper.limpiarEspacios(this.formArchivado);
        if (!this.formArchivado.valid) {
          this.formArchivado.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: '¿Está seguro que desea archivar el documento?',
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, archivar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // TODO: implementar formularios reactivos
              const archivado = new Archivado();
              archivado.observacion =
                this.formArchivado.controls['observacion'].value;
              archivado.instante = new Date();
              this.documentoFacade
                .archivar(evento.id, this.seguimiento.id, archivado)
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formArchivado.controls['observacion'].setValue('');
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          });
        }
        break;
      }
      case 'devolver': {
        FuncionesHelper.limpiarEspacios(this.formDevolucion);
        if (!this.formDevolucion.valid) {
          this.formDevolucion.markAllAsTouched();
          return;
        } else {
          Swal.fire({
            title: '¿Está seguro que desea devolver el documento?',
            text: 'Ésta operación es irreversible',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, devolver',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              const devolver = new Devolver();
              devolver.cite = this.documento.cite;
              devolver.hojaRuta = this.documento.hojaRutaNumero;
              // TODO: obtener informacion del remitente
              devolver.destinatario = new Destinatario();
              devolver.destinatario.nombre = '';
              devolver.destinatario.puesto = '';
              devolver.aclaracion =
                this.formDevolucion.controls['aclaracion'].value;
              devolver.instante = new Date();
              this.documentoFacade
                .devolver(
                  evento.id,
                  this.documentoAdjunto.id,
                  devolver,
                  'DERIVAR'
                )
                .then((respuesta) => {
                  if (respuesta.tipoRespuesta === 'Exito') {
                    this.formDevolucion.controls['aclaracion'].setValue('');
                    this.router.navigate(this.redireccion);
                  }
                });
            }
          });
        }
        break;
      }
    }
  }

  ejecutarOperacion(evento: any): void {
    switch (evento.operacion) {
    }
  }
}
